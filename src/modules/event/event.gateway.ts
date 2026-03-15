import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { WorkerService } from '../worker/worker.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/ai-events',
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private aiWorkers = new Set<string>(); // Track AI worker client IDs

  constructor(private readonly workerService: WorkerService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from multiple sources (priority order):
      // 1. Authorization header (with or without Bearer prefix)
      // 2. Custom token header
      // 3. Auth handshake
      // 4. Query params (fallback)
      const authHeader = client.handshake.headers.authorization || client.handshake.headers.Authorization;
      const tokenHeader = client.handshake.headers.token;
      
      let token = client.handshake.auth.token || client.handshake.query.token;
      
      // Extract from Authorization header
      if (authHeader && typeof authHeader === 'string') {
        // Support both "Bearer <token>" and direct token
        token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
      }
      
      // Extract from custom token header
      if (!token && tokenHeader) {
        token = tokenHeader;
      }
      
      const clientIP = client.handshake.address;
      
      console.log(`Connection attempt from ${clientIP} - Socket ID: ${client.id}`);
      console.log(`   Token source: ${authHeader ? 'Authorization Header' : tokenHeader ? 'Token Header' : client.handshake.auth.token ? 'Auth Handshake' : 'Query Params'}`);
      
      if (!token) {
        console.log(`Client ${client.id} rejected: No token provided`);
        console.log(`   IP: ${clientIP}`);
        console.log(`   Checked: Authorization header, token header, auth handshake, query params`);
        client.disconnect();
        return;
      }

      // Check for service token (for AI workers)
      const serviceToken = process.env.AI_SERVICE_TOKEN || 'ai-worker-service-token-12345';
      if (token === serviceToken) {
        client.data.user = { 
          preferred_username: 'ai-worker-service',
          type: 'service',
          socketId: client.id 
        };
        client.data.authenticated = true;
        
        // Save worker to database (deactivate old workers from same IP)
        await this.workerService.registerWorker({
          socketId: client.id,
          type: 'service',
          username: 'ai-worker-service',
          ipAddress: clientIP,
          authMethod: 'Service Token',
          metadata: {
            userAgent: client.handshake.headers['user-agent'],
          },
        });
        
        console.log(`AI Worker connected successfully!`);
        console.log(`   Socket ID: ${client.id}`);
        console.log(`   IP: ${clientIP}`);
        console.log(`   Auth: Service Token`);
        console.log(`   Saved to database`);
        return;
      }

      // Verify JWT token for regular users
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET || '', {
        algorithms: [process.env.JWT_ALGORITHIM as any || 'RS256'],
      });

      // Store user info in socket
      client.data.user = decoded;
      client.data.authenticated = true;

      // Save user worker to database (deactivate old workers from same IP)
      await this.workerService.registerWorker({
        socketId: client.id,
        type: 'user',
        username: (decoded as any).preferred_username || 'unknown',
        ipAddress: clientIP,
        authMethod: 'JWT Token',
        metadata: {
          userAgent: client.handshake.headers['user-agent'],
          tokenInfo: {
            iss: (decoded as any).iss,
            exp: (decoded as any).exp,
          },
        },
      });

      console.log(`User connected successfully!`);
      console.log(`   Socket ID: ${client.id}`);
      console.log(`   IP: ${clientIP}`);
      console.log(`   Username: ${(decoded as any).preferred_username}`);
      console.log(`   Auth: JWT Token`);
      console.log(`   Saved to database`);
      
    } catch (error) {
      console.log(`Client ${client.id} authentication failed!`);
      console.log(`   IP: ${client.handshake.address}`);
      console.log(`   Reason: ${error.message}`);
      console.log(`   Token provided: ${(client.handshake.auth.token || client.handshake.query.token || '').substring(0, 20)}...`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.aiWorkers.delete(client.id);
    
    // Update worker status in database
    this.workerService.disconnectWorker(client.id).catch(err => {
      console.error(`Failed to update worker disconnect: ${err.message}`);
    });
    
    console.log(`Client disconnected: ${client.id}`);
    console.log(`   Updated in database`);
  }

  /**
   * AI Worker joins the processing room
   */
  @SubscribeMessage('join-ai-worker')
  handleJoinAIWorker(@ConnectedSocket() client: Socket) {
    if (!client.data.authenticated) {
      throw new UnauthorizedException('Not authenticated');
    }

    this.aiWorkers.add(client.id);
    client.join('ai-workers');
    console.log(`✅ AI Worker ${client.id} joined processing room`);
    
    return { success: true, message: 'Joined AI workers room' };
  }

  /**
   * Emit AI processing event to AI workers room only
   */
  emitAIEvent(pattern: string, payload: any) {
    this.server.to('ai-workers').emit(pattern, payload);
    console.log(`📡 Emitted to AI workers room - Pattern: ${pattern}, Workers: ${this.aiWorkers.size}`);
  }

  /**
   * Check if any AI workers are connected
   */
  hasActiveWorkers(): boolean {
    return this.aiWorkers.size > 0;
  }

  /**
   * Get number of active AI workers
   */
  getActiveWorkersCount(): number {
    return this.aiWorkers.size;
  }
}

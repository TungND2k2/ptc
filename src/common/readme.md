# Common Project

This repository contains common utilities and components used across various modules in your NestJS application. 

## Structure

1. **Modules**: Core modules used throughout the application.
2. **Guards**: Custom guards for handling authorization and access control.
3. **Decorators**: Custom decorators to simplify code and add functionality.
4. **Types**: TypeScript types and interfaces used across the application.
5. **Utils**: Utility functions and classes including logging and other helper functions.

## Utils

### Logging Interceptor

The `LoggingInterceptor` is a utility that logs request-related information and sends it to RabbitMQ for tracking and analysis.

#### Features 

- **Logs Request Information**: Captures user data and request contexts.
- **Sends Logs to RabbitMQ**: Connects to RabbitMQ, declares a queue, and sends log data.
- **Manages Connections**: Closes RabbitMQ connections after use to optimize resources.

#### Installation

1. **Install Dependencies**:

   Ensure that `amqplib` is installed:

   ```bash
   npm install amqplib
   ```
   Set up the RABBITMQ_URL environment variable with the RabbitMQ connection URL.
2. **Use**:
    ```bash
      @UseInterceptors(LoggingInterceptor)
    ```
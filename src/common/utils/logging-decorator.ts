import * as amqp from 'amqplib';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function ExtractPayloadInfo(
  service: string,
  module: string,
  action: string,
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const payload = args[0]; // Lấy payload từ đối số đầu tiên của hàm
        const result = await originalMethod.apply(this, args); // Gọi hàm gốc và lấy kết quả

        // Kiểm tra kết quả của hàm gốc và chỉ log và gửi thông tin khi kết quả là 'ack' và payload.result là 'success'
        if (result === 'ack' && payload.result === 'success') {
          console.log('Service:', service);
          console.log('Module:', module);
          console.log('Action:', action);
          const patternData = {
            pattern: 'service-log',
            data: {
              service: service,
              module: module,
              action: action,
              createdBy: {
                orgId: payload.customerId,
                userId: payload.user.id,
              },
              createdAt: new Date(),
              input: payload.service,
              preData: payload.preData,
              postData: payload.postData,
            },
          };

          // Thiết lập kết nối với RabbitMQ
          await amqp.connect(
            process.env.RABBITMQ_URL,
            function (error0, connection) {
              if (error0) {
                throw error0;
              }
              connection.createChannel(async (error1, channel) => {
                if (error1) {
                  throw error1;
                }

                const queueName = process.env.SLM_QUEUE;

                // Khai báo queue
                await channel.assertQueue(queueName, { durable: false });

                // Gửi message vào queue
                await channel.sendToQueue(
                  queueName,
                  Buffer.from(JSON.stringify(patternData)),
                  { persistent: true },
                );

                console.log('Message sent to the slm queue successfully.');

                // Đóng kết nối
                await channel.close();
                await connection.close();
              });
            },
          );
        }

        return result; // Trả về kết quả của hàm gốc
      } catch (error) {
        console.error(error); // Log lỗi nếu có
        throw error; // Throw lỗi để chuyển tiếp cho middleware xử lý lỗi
      }
    };

    return descriptor;
  };
}

// export const ExtractPayloadInfo = createParamDecorator(
//     (data: any, ctx: ExecutionContext) => {
//       // Lấy dữ liệu trực tiếp từ tham số payload
//       const payload = data;
//       console.log('Payload:', payload);

//       // Thực hiện các thao tác khác với dữ liệu payload ở đây nếu cần

//       // Không cần trả về payload ở đây, chỉ cần trích xuất thông tin từ payload và sử dụng nó trong hàm được đánh dấu
//       return payload;
//     },
//   );

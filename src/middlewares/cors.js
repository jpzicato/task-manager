import cors from 'cors';

export default cors({
  origin: /^http:\/\/(?:localhost|(?:\d{1,3}\.){3}\d{1,3}):(\d+)$/,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});

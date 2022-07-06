export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            TokenSecret: string;
            TokenAge: number;
            DB_NAME: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_PORT: number;
            // ENV: 'test' | 'dev' | 'prod';
        }
    }
}

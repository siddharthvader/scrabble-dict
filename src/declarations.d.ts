// This allows you to import .txt files
declare module "*.txt" {
    const content: string;
    export default content;
}
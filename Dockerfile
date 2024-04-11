# 第一阶段：构建
FROM node:16.8

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 拷贝应用程序代码
COPY . .

# 构建应用程序
RUN npm run build

# 启动命令
CMD [ "npm", "start" ]
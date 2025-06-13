# swagger-openapi-utils

swagger 生成 service 文件时，可能需要对数据做处理。

## 安装
```node
npm install swagger-openapi-utils -D
```

## 使用
```js
import { camelCase, getPathName, getTagName, openApiDataHandler } from "swagger-openapi-utils"
```

| 名称           | 类型 | 说明               |
| -------------- | ---- | ------------------ |
| camelCase | (name: string, type: 1｜2) => string  | type默认为1。1返回小驼峰字符串，2返回大驼峰字符串。 |
| getPathName | (path: string, maxLength = 5) => string   | 根据路径生成字符串，maxLength 代表使用路径由斜杠分隔的几个单位 |
| getTagName | (name: string) => string | name中斜杠、点后面的会舍弃，中文会转为拼音，并去除空格 |
| openApiDataHandler | (jsonData: object) => object  | 入参为 swagger json data |

# Blog Server Api 文档
## Api分类
[用户](#user)
[草稿](#draft)
[标签](#tag)
[文章](#article)

## 请求地址
请求地址为 http://lh-blog.azurewebsites.net/ 开头的地址

## 请求方法
只支持 GET 与 POST 方式的请求

## 编码
请使用 UTF-8 方式编码

## 通用调用参数

|字段|必选|类型|说明|
|:-:|:-:|:-:|:-:|
|access_token|true|string|授权字段|

## 通用错误代码

|code|说明|
|:-:|:-:|
|400|调用参数错误|
|401|access_token异常|
|500|服务器内部错误|

> 具体错误可以参照返回数据的 msg 字段

<h2 id="user">用户Api</h2>

### 1. 登录

#### 调用地址
> http://lh-blog.azurewebsites.net/api/login

#### 请求方式
> POST

#### 请求参数(body)
|字段|必选|类型|说明|
|:-:|-|-|-|-|
|username|true|string|用户名|
|password|true|string|密码|

#### 返回数据
|字段|类型|说明|
|:-:|-|-|
|access_token|string|登录授权码|
|refresh_token|string|刷新授权码|
|expires|date|登录授权码过期时间|

### 2. 注册

#### 调用地址
> http://lh-blog.azurewebsites.net/api/register

#### 请求方式
> POST

#### 请求参数(body)
|字段|必选|类型|说明|
|:-:|-|-|-|-|
|username|true|string|用户名|
|password|true|string|密码|

#### 返回数据
> 无

### 3. 刷新登录

#### 调用地址
> http://lh-blog.azurewebsites.net/api/refresh_token

#### 请求方式
> GET

#### 请求参数(query)
|字段|必选|类型|说明|
|:-:|-|-|-|-|
|refresh_token|true|string|刷新token|

#### 返回数据
|字段|类型|说明|
|:-:|-|-|
|access_token|string|登录授权码|
|refresh_token|string|刷新授权码|
|expires|date|登录授权码过期时间|

<h2 id="draft">草稿</h2>

### 1. 创建草稿

#### 调用地址
> http://lh-blog.azurewebsites.net/api/createDrafts

#### 请求方式
> POST

#### 请求参数(body)
|字段|必选|类型|说明|
|:-:|-|-|-|-|
|title |true|string|文章标题|

#### 返回数据
> 文章id

### 2. 草稿列表

#### 调用地址
> http://lh-blog.azurewebsites.net/api/draftsList

#### 请求方式
> GET

#### 请求参数(body)
|字段|必选|类型|说明|
|:-:|-|-|-|-|
|tag |false|int|标签ID|

#### 返回数据
|字段|类型|说明|
|:-:|-|-|
|id|int|草稿id|
|title|string|草稿标题|
|content|string|草稿内容|
|summary|string|草稿摘要|
|createTime|date|创建时间|
|lastModify|date|最后修改时间|
|isPublish|bool|是否已经发布|
|username|string|作者|

### 3. 草稿详情

#### 调用地址
> http://lh-blog.azurewebsites.net/api/draftDetail

#### 请求方式
> GET

#### 请求参数(body)
|字段|必选|类型|说明|
|:-:|-|-|-|-|
|id|true|int|草稿ID|

#### 返回数据
|字段|类型|说明|
|:-:|-|-|
|id|int|草稿id|
|title|string|草稿标题|
|content|string|草稿内容|
|tags|array|标签|
|summary|string|草稿摘要|
|createTime|date|创建时间|
|lastModify|date|最后修改时间|
|isPublish|bool|是否已经发布|
|username|string|作者|

### 4. 修改草稿

#### 调用地址
> http://lh-blog.azurewebsites.net/api/modifyDraft

#### 请求方式
> POST

#### 请求参数
|字段|必选|类型|说明|位置|
|:-:|-|-|-|-|-|
|id|true|int|草稿ID|query|
|title|false|string|标题|body|
|content|false|string|内容|body|
|tags|false|array|标签|body|

#### 返回数据
> 无

### 5. 删除草稿

#### 调用地址
> http://lh-blog.azurewebsites.net/api/deleteDraft

#### 请求方式
> POST

#### 请求参数
|字段|必选|类型|说明|位置|
|:-:|-|-|-|-|-|
|id|true|int|草稿ID|query|

#### 返回数据
> 无

### 6. <span id="publish">发布草稿</span>

#### 调用地址
> http://lh-blog.azurewebsites.net/api/publish

#### 请求方式
> POST

#### 请求参数
|字段|必选|类型|说明|位置|
|:-:|-|-|-|-|-|
|draftId|true|int|草稿ID|query|

#### 返回数据
> 无

<h2 id="tag">标签</h2>

### 1. 创建标签

#### 调用地址
> http://lh-blog.azurewebsites.net/api/createTag

#### 请求方式
> POST

#### 请求参数
|字段|必选|类型|说明|位置|
|:-:|-|-|-|-|-|
|name |true|string|标签名|body|

#### 返回数据
|字段|类型|说明|
|:-:|-|-|-|
|id|int|标签ID|
|name|string|标签名|

### 2. 删除标签

#### 调用地址
> http://lh-blog.azurewebsites.net/api/deleteTag

#### 请求方式
> POST

#### 请求参数
|字段|必选|类型|说明|位置|
|:-:|-|-|-|-|-|
|name|false|string|标签名|body|
|id|false|int|标签id|body|

#### 返回数据
> 无

### 3. 标签列表

#### 调用地址
> http://lh-blog.azurewebsites.net/api/tagList

#### 请求方式
> GET

#### 请求参数
|字段|必选|类型|说明|位置|
|:-:|-|-|-|-|-|
|start-with|false|string|查询以该字段开头的所有标签|query|

#### 返回数据
> 标签数组

数组内容：

|字段|类型|说明|
|:-:|-|-|-|
|id|int|标签ID|
|name|string|标签名|

### 4. 修改标签

#### 调用地址
> http://lh-blog.azurewebsites.net/api/modifyTag

#### 请求方式
> POST

#### 请求参数
|字段|必选|类型|说明|位置|
|:-:|-|-|-|-|-|
|name|true|string|标签名|body|
|id|true|int|标签id|query|

#### 返回数据
|字段|类型|说明|
|:-:|-|-|-|
|id|int|标签ID|
|name|string|标签名|

<h2 id="article">文章</h2>

> 该分类下的接口不需要access_token参数

### 1. ~~创建文章~~（**Deprecated**，请用 [发布文章](#publish) 代替）

#### 调用地址
> http://lh-blog.azurewebsites.net/api/createTag

#### 请求方式
> POST

#### 请求参数
|字段|必选|类型|说明|位置|
|:-:|-|-|-|-|-|
|title|true|string|标题|body|
|content|true|string|内容|body|
|tags|true|array|标签|body|
|hidden|true|bool|文章是否隐藏|body|

#### 返回数据
|字段|类型|说明|
|:-:|-|-|
|id|int|文章id|

### 2. 文章列表

#### 调用地址
> http://lh-blog.azurewebsites.net/api/articleList

#### 请求方式
> GET

#### 请求参数
|字段|必选|类型|说明|位置|
|:-:|-|-|-|-|-|
|id|false|int|标签id|query|
|page|false|int|页码，默认为0|query|
|limit|false|int|单页返回的记录条数，最大不超过100，默认为10|query|

#### 返回数据
|字段|类型|说明|
|:-:|-|-|-|
|articles|array|文章列表|
|total|int|文章总数目|

##### 返回字段"articles"子项
|字段|类型|说明|
|:-:|-|-|-|
|content|array|文章列表|
|createTime|int|文章总数目|
|id|int|文章id|
|lastModify|date|最后修改时间|
|summary|string|文章摘要|
|title|string|标题|
|user|string|作者|

### 3. 文章详情

#### 调用地址
> http://lh-blog.azurewebsites.net/api/articleDetail

#### 请求方式
> GET

#### 请求参数
|字段|必选|类型|说明|位置|
|:-:|-|-|-|-|-|
|id|false|int|标签id|query|

#### 返回数据
|字段|类型|说明|
|:-:|-|-|-|
|article|object|文章|
|nextArticle|object|下一篇文章|
|preArticle|object|上一篇文章|

##### 返回字段"article"
|字段|类型|说明|
|:-:|-|-|-|
|content|array|文章列表|
|createTime|int|文章总数目|
|id|int|文章id|
|lastModify|date|最后修改时间|
|summary|string|文章摘要|
|tags|array|标签|
|title|string|标题|
|user|string|作者|

##### 返回字段"nextArticle"和"preArticle"
|字段|类型|说明|
|:-:|-|-|-|
|id|int|文章id|
|title|string|标题|

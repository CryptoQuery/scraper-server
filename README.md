# CryptoQuery Scraper Server  
This server is used by the CrytpoQuery scraper bot and other applications to get, change, and store article data 
pulled in from the scraper bot.  
## Start Application  
Build:  
`npm install`  
Start:  
`npm start`  
## IP Address  
  * 104.131.149.181  
  
## Endpoints  
### /addArticle  
#### Description:  
Add articles to Mongo Database using aes encryption to ensure only scraper bots are adding articles.  
#### Body Parameters:  
link published_at author title description article
```json
{
  "link": "",
  "published_at": "",
  "author": "",
  "title": "",
  "description": "",
  "article": ""
}
```  
Note: Request must use AES encryption with the private key before sending request.  
#### Final Body Parameters  
```json
{
  "auth": "<aes_cipher_text>"
}
```
### /getArticles  
#### Description:  
Gets all articles based on article ids in the request body.  
#### Body Parameters:  
```json
{
  "article_id": [""]
}
```  
### /getArticlesByUrl  
#### Description:  
Gets articles based on urls supplied in the request body.  
#### Body Parameters:  
```json
{
  "url": ["https://..."]
}
```  
### /getArticlesByDate  
#### Description:  
Gets articles based on a start and end date supplied in the request body.  
#### Body Parameters:  
```json
{
  "start_date": "",
  "end_date": ""
}
```  
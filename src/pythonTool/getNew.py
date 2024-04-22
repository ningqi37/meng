import requests
from bs4 import BeautifulSoup

URL = 'https://www.chinanews.com/scroll-news/news1.html'
Headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
}
response = requests.get(url=URL, headers=Headers)
response.encoding = 'utf-8'
html_source = response.text if response.status_code == 200 else '状态码异常'
# print(html_source)

soup = BeautifulSoup(html_source, 'html.parser')

li_list = soup.select('body > div.w1280.mt20 > div.content-left > div.content_list > ul > li')
# print(li_list)

for li in li_list:
    if str(li) != '<li class="nocontent"></li>':
        news_type = li.select_one('li > .dd_lm > a').text
        news_title = li.select_one('li > .dd_bt > a').text
        news_link = 'https://www.chinanews.com' + li.select_one('li > .dd_bt > a').attrs['href']
        news_time = li.select_one('li > .dd_time').text
        print(news_type, news_title, news_link, news_time)
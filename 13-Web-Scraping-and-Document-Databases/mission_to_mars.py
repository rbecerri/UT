
# coding: utf-8

# In[196]:


from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import re, time


# In[197]:

def scrape():

        executable_path = {'executable_path': 'chromedriver.exe'}
        browser = Browser('chrome', **executable_path, headless=False)


        # # NASA Mars News

        # In[201]:

        scrape_dictionary = {} 

        url = "https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest"
        browser.visit(url)
        # HTML object
        html = browser.html
        # Parse HTML with Beautiful Soup
        soup = BeautifulSoup(html, 'html.parser')


        # In[202]:


        #Scrape the NASA Mars News Site and collect the latest News Title and Paragraph Text
        news = soup.find_all('li', class_='slide')
        latest_news_title = news[0].find('div', class_='content_title').find('a').get_text()
        latest_news_p =  news[0].find('div', class_='article_teaser_body').get_text() 
        scrape_dictionary["latest_news_title"] = latest_news_title
        scrape_dictionary["latest_news_p"] = latest_news_p
        
        # news_items = []
        # for item in news:
        #         news_items.append({ "news_title" : item.find('div', class_='content_title').find('a').get_text(),
        #                         "news_p" : item.find('div', class_='article_teaser_body').get_text() } )
        # scrape_dictionary["news_items"] = news_items

        # # JPL Mars Space Images - Featured Image

        # In[206]:


        url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
        browser.visit(url)
        browser.find_link_by_partial_text("FULL IMAGE").click()
        time.sleep(10)
        browser.find_link_by_partial_text("more info").click()
        time.sleep(5)
        # HTML object
        html = browser.html
        # Parse HTML with Beautiful Soup
        soup = BeautifulSoup(html, 'html.parser')

        # In[205]:

        #style = soup.find('article')['style']
        #url = re.findall('url\((.*?)\)', style)[0].replace("'", "")
        url = soup.find('img', class_="main_image")['src']
        featured_image_url = "https://www.jpl.nasa.gov" + url
        featured_image_url

        scrape_dictionary["featured_image_url"] = featured_image_url

        # # Mars Weather

        # In[207]:


        url = "https://twitter.com/marswxreport?lang=en"
        browser.visit(url)
        # HTML object
        html = browser.html
        # Parse HTML with Beautiful Soup
        soup = BeautifulSoup(html, 'html.parser')


        # In[208]:


        tweets = soup.find_all('div', class_='js-tweet-text-container')
        #tweets = soup.find_all('p', class_='tweet-text')
        mars_weather = ""

        for tweet in tweets:
                if tweet.p.get_text().startswith("Sol "):
                        #print(tweet)
                        mars_weather = tweet.p.get_text()
                        break
        
        mars_weather
        scrape_dictionary["mars_weather"] = mars_weather

        # # Mars Facts

        # In[209]:


        url = "https://space-facts.com/mars"
        browser.visit(url)
        # HTML object
        html = browser.html


        # In[210]:


        mars_facts_df = pd.read_html(html)[0]
        mars_facts_df.columns = ["Description", "Value"]
        mars_facts_df.set_index("Description", inplace=True)
        mars_facts_html = mars_facts_df.to_html(na_rep = " ", classes="table table-sm table-striped", justify="left", col_space=0)
        mars_facts_html

        scrape_dictionary["mars_facts_html"] = mars_facts_html
        # # Mars Hemispheres

        # In[211]:


        #mars_hemispheres = ["https://astrogeology.usgs.gov/search/map/Mars/Viking/cerberus_enhanced",
        #                "https://astrogeology.usgs.gov/search/map/Mars/Viking/schiaparelli_enhanced",
        #                "https://astrogeology.usgs.gov/search/map/Mars/Viking/syrtis_major_enhanced",
        #                "https://astrogeology.usgs.gov/search/map/Mars/Viking/valles-marineris_enhanced"]
        hemisphere_image_urls = []
        url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
        browser.visit(url)
        html = browser.html
        soup = BeautifulSoup(html, 'html.parser')
        mars_hemispheres = []
        [mars_hemispheres.append("https://astrogeology.usgs.gov" + item_url.a['href']) for item_url in soup.findAll("div", class_="description")]

        # In[212]:


        for url in mars_hemispheres:
                browser.visit(url)
                # HTML object
                html = browser.html
                # Parse HTML with Beautiful Soup
                soup = BeautifulSoup(html, 'html.parser')

                images = soup.find('div', class_='wide-image-wrapper').find_all('li')
                img_url = images[0].a['href']
                hemisphere_image_urls.append( { "title" : soup.find('h2', class_='title').text, "img_url" : img_url })

                hemisphere_image_urls

        scrape_dictionary["hemisphere_image_urls"] = hemisphere_image_urls

        return scrape_dictionary
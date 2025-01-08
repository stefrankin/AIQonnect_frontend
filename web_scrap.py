from bs4 import BeautifulSoup
import requests
import csv

url = 'https://billboard.com/charts/hot-100/'
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"}
page = requests.get(url, headers=headers)
soup = BeautifulSoup(page.text, "html.parser")

for element in soup.find_all('li', **{'class': 'o-chart-results-list__item'}):
    song_title_tag = element.find('h3', id='title-of-a-story')
    artist_tag = element.find('span', **{'class': 'c-label'})
    if song_title_tag and artist_tag:
        song_title = song_title_tag.text.strip()
        artist = artist_tag.text.strip()
        print(song_title, artist)

title = soup.title.string
anchor_tags = soup.find_all('li', )   

h3_tags = soup.find_all('h3', class_='chart-element__information__song text--truncate color--primary')

num_posts = int(input(f"How many posts would you like to scrap? (1-{len(h3_tags)}): "))



for index, h3 in enumerate(h3_tags[:num_posts]):

    csv_file = "scraped_data.csv"

    with open(csv_file, "w") as file:
        fieldnames = ["Song", "Artists"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        writer.writeheader()

        for data in csv_file:
             writer.writerow({"Song": data['title'], "Artists": data['artist']})

    print(f"Data has been scraped and saved to {csv_file}")
# editRatingUpdate.py (재가공 평점을 user_info.csv에 업데이트 하는 파일)
# -*- coding: utf-8 -*-
import pandas as pd
import sys
from csv import DictWriter

def process(userId, rating, resultEmotionPer, concentration, parammovieTitle):
    df = pd.read_csv('csv/movie_info.csv', low_memory=False)

    for i in range(len(df)):
        if df['original_title'][i] == parammovieTitle:
            movieID = str(df['id'][i])
            break

    rating = int(rating) + int(resultEmotionPer) / 200 + int(concentration) / 200
    rating = str(round(rating,2))
    headersCSV = ['userId', 'movieId', 'rating']
    result_row = {'userId': userId, 'movieId': movieID, 'rating': rating}

    with open('csv/user_info.csv', 'a', newline='') as f_object:
        writer_object = DictWriter(f_object, fieldnames=headersCSV)
        writer_object.writerow(result_row)
        f_object.close()


#process("621",5.0,80,90,"Toy Story")
process(str(sys.argv[1]), int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]),str(sys.argv[5]))
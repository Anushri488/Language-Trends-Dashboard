from flask import Flask, jsonify
from flask_cors import CORS
import csv
from collections import defaultdict

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "✅ Flask is working!"

@app.route('/api/data')
def get_language_trends():
    file_name = "/home/Anushri/converted.csv"

    # df → we'll treat this as raw data
    df = []
    with open(file_name, newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            df.append(row)

    # df_clean: filter rows with Year and Language
    df_clean = [row for row in df if row['Year'] in ['2022', '2023', '2024'] and row['Language']]

    # question_tags: group by Question No
    question_tags = defaultdict(list)
    for row in df_clean:
        question_tags[row['Question No']].append(row)

    # tag_counts (normalized): Language → Year-wise count
    tag_counts = defaultdict(lambda: {'2022': 0, '2023': 0, '2024': 0})
    for rows in question_tags.values():
        tag_count = len(rows)
        for row in rows:
            year = row['Year']
            lang = row['Language']
            tag_counts[lang][year] += 1 / tag_count

    # top_tags_by_year = top 10 overall
    top_tags_by_year = sorted(
        tag_counts.items(),
        key=lambda x: sum(x[1].values()),
        reverse=True
    )[:10]

    # result = formatted JSON
    result = {
        lang: {year: round(count, 2) for year, count in counts.items()}
        for lang, counts in top_tags_by_year
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5050, debug=True)

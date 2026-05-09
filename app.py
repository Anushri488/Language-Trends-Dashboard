# 📊 Language Trends Dashboard

> Real-time analysis of programming language popularity using Stack Overflow data (2022–2024).

🔗 **Live Demo:** [View Dashboard](https://69bfdb4d7955c683dbfa9acd--eclectic-mooncake-3e2f5c.netlify.app/)

---

## 🖼️ Preview

<!-- Add screenshot: ![Dashboard Preview](./assets/preview.png) -->

---

## 🎯 What This Project Does

This dashboard analyzes **65,000+ Stack Overflow questions** to surface real trends in programming language adoption. Each question can have multiple tags, so the scoring is **normalized per question** to avoid bias — a question tagged with 5 languages doesn't artificially inflate all 5.

### Key Insights It Reveals
- Python has been the dominant language across all 3 years
- TypeScript saw a notable rise in 2023 before stabilizing
- Excel, Flutter, and Android showed growth in 2024
- Node.js and Pandas showed declining activity

---

## ✨ Features

| Feature | Details |
|---|---|
| 📈 Line Chart | Trend view for any selected N languages over 2022–2024 |
| 📊 Bar Chart | Side-by-side year comparison per language |
| 🕸️ Radar Chart | Multi-dimensional view of top 8 languages |
| 🔢 Live Rankings | Top-10 table with activity scores and YoY delta |
| ↕️ Delta Chart | 2023→2024 change — shows who's rising and falling |
| 🔽 Filters | Adjust Top-N (5/10/15/20) and year selection dynamically |
| 🌐 REST API | `/api/data` and `/api/summary` endpoints for data consumption |
| ⚡ Fast Load | Data pre-processed and cached in-memory on first API call |

---

## 🛠️ Tech Stack

**Frontend**
- HTML5, CSS3, Vanilla JavaScript
- [Chart.js 4](https://www.chartjs.org/) — line, bar, and radar charts
- Google Fonts: Syne + JetBrains Mono

**Backend**
- Python 3 · Flask · Flask-CORS
- CSV processing with Python's built-in `csv` module
- In-memory caching — no database needed

**Data**
- Stack Overflow question tags dataset (65K+ rows)
- Fields: `Question No`, `Year`, `Relative Time`, `Language`
- Normalization: each question contributes exactly 1.0 total score across all its tags

---

## 📁 Project Structure

```
Language-Trends-Dashboard/
│
├── app.py               # Flask API — data processing & endpoints
├── converted.csv        # Stack Overflow dataset (65K+ rows)
│
└── frontend/
    ├── index.html       # Dashboard layout
    ├── style.css        # Dark theme, grid background, animations
    └── script.js        # Charts, filters, embedded data fallback
```

---

## ⚙️ Setup & Run

### Prerequisites
- Python 3.8+
- pip

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/Language-Trends-Dashboard.git
cd Language-Trends-Dashboard

# 2. Install Python dependencies
pip install flask flask-cors

# 3. Start the Flask server
python app.py
# → Running on http://localhost:5050

# 4. Open the frontend
# Open frontend/index.html in any browser
# (The frontend also has embedded data so it works offline)
```

### API Endpoints

```
GET /api/data     → Top-20 languages with 2022/2023/2024 scores
GET /api/summary  → Top language, fastest growing, sharpest decline
```

---

## 🔬 Data Processing Logic

```python
# Each question can have multiple tags.
# Normalization ensures each Q contributes exactly 1.0 score total.

for question in questions:
    n = number_of_tags_in_question
    for tag in question.tags:
        tag_score[tag][year] += 1 / n

# Then sort by total score across all years → pick top 20
```

This prevents high-tag-count questions from inflating scores unfairly.

---

## 🔮 Planned Enhancements

- [ ] Live Stack Overflow API integration
- [ ] Monthly/quarterly granularity (currently annual)
- [ ] Language category grouping (Web, ML/AI, Systems, Mobile)
- [ ] Export chart as PNG/CSV
- [ ] ML-based trend prediction for 2025

---

## 👩‍💻 Author

**Anushri Mishra**
B.Tech CSE, Sitare University (SRMU), Lucknow

---

## 📄 License

For educational and portfolio purposes. Data from Stack Overflow (public dataset).

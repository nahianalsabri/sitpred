# SitPred — Situation Predictor
### Game Theory × AI · Predict your competitive outcome.

SitPred is an AI powered web application that uses game theory frameworks to analyse competitive business scenarios and predict strategic outcomes. Describe any real world competitive situation and SitPred will identify the Nash equilibrium, predict each player's dominant move, and recommend the best strategic response.

**Live demo:** https://sitpred.onrender.com

---

## What it does

You describe a competitive business situation — a pricing war, a product launch timing decision, a market entry — and SitPred returns:

- **Equilibrium type** — the game theory framework that applies (Nash, Dominant Strategy, etc.)
- **Stability & conflict risk** rating
- **Player strategy predictions** — what each player will likely do and why
- **Outcome probabilities** — the most likely scenarios ranked by likelihood
- **Strategic recommendation** — the best move for the focal player
- **Long-term market prediction** — where this situation converges in 2–4 quarters

---

## Built with

- **Frontend** — HTML, CSS, JavaScript
- **Backend** — Node.js + Express
- **AI** — Groq API (Llama 3.3 70B)
- **Hosting** — Render.com
- **Framework** — Game theory (Nash equilibrium, Prisoner's Dilemma, Stackelberg competition, dominant strategies, repeated games)

---

## Project structure

```
sitpred/
├── public/
│   └── index.html       # Frontend UI
├── server.js            # Express backend + Groq API proxy
├── package.json         # Node dependencies
├── .env.example         # Environment variable template
└── README.md            # This file
```

---

## Example scenarios to try

- *Two Canadian grocery chains competing on private-label pricing — Loblaws drops by 15%, Metro must respond*
- *Three SaaS startups launching AI features simultaneously — release now or wait for a polished product?*
- *An established home care agency vs a new VC-backed competitor entering the same city*

---

## Why game theory?

Game theory gives us a mathematical framework for predicting rational behaviour in competitive situations. Unlike gut-feel analysis, it forces us to model every player's incentives, constraints, and likely responses — and find the equilibrium where no player benefits from changing their strategy unilaterally.

SitPred brings this framework to anyone, without needing a PhD in economics.

---

## About

Built by **Nahian Al Sabri** — Product Manager and AI Transformation Consultant.

- LinkedIn: [linkedin.com/in/nahianalsabri](https://linkedin.com/in/nahianalsabri)
- GitHub: [github.com/nahianalsabri](https://github.com/nahianalsabri)

---

*SitPred is a prototype built to demonstrate applied AI product thinking. Predictions are AI-generated and should be used as strategic input, not financial advice.*

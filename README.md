# FeatureBoard

FeatureBoard is a lightweight, modern feedback board application inspired by tools like Canny. Built using **[Wasp](https://wasp-lang.dev)** and styled with **Tailwind CSS**, it supports **light/dark themes** and enables transparent collaboration between users and product teams.

## 🌟 Features

- 📄 **Two Pages**:
  - `/features` – Public list of all feature requests
  - `/features/:featureId` – Detailed view of individual features
- 👁️ **Public Browsing**: All users (even anonymous) can explore features and their statuses.
- 📝 **Feature Submission**: Logged-in users can:
  - Submit new feature requests using **Markdown** with **live preview**
  - Vote on feature ideas
  - Comment on features
  - React to other users' comments
- 🛠️ **Admin Capabilities**:
  - Change feature status (Proposed, Planned, In Progress, Completed)
  - Edit & Delete features and comments
- 🌓 **Theming**: Fully responsive **light and dark modes**
- 🔍 **Filtering & Sorting**:
  - Search bar to quickly find features
  - Sort by:
    - Most Recent
    - Most Upvoted
    - Most Discussed

## 🚀 Getting Started

 ```bash
 wasp db migrate-dev
 wasp start
 ```

## 🤝 Contributions

Contributions are welcome! Feel free to fork the repo and submit a pull request.

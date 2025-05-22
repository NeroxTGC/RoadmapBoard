# FeatureBoard

FeatureBoard is a lightweight, modern feedback board application inspired by tools like Canny. Built using **[Wasp](https://wasp-lang.dev)** and styled with **Tailwind CSS**, it supports **light/dark themes** and enables transparent collaboration between users and product teams.

![image](https://github.com/user-attachments/assets/8cf4bc1d-42db-466b-85c6-8a0391a15f3e)

![image](https://github.com/user-attachments/assets/2b94b40d-e55e-45dc-9a5f-1c9fa2023b63)

![image](https://github.com/user-attachments/assets/71c9ed63-03a3-4ae1-a943-7186baa1af6d)

![image](https://github.com/user-attachments/assets/be67f4c2-e1a8-493c-804f-fe233ea7b1e2)


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

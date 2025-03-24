class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // Method to fetch user info
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._handleResponse);
  }

  // Method to fetch cards
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._handleResponse);
  }

  // Method to edit user info
  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._handleResponse);
  }

  editUserAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._handleResponse);
  }

  // Method to create a new card
  createCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._handleResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._handleResponse);
  }

  addLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then(this._handleResponse);
  }

  removeLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._handleResponse);
  }

  // Method to fetch both user info and cards
  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()])
      .then(([userInfo, cards]) => {
        return { userInfo, cards };
      })
      .catch((error) => {
        console.error("Error fetching app info:", error);
        return Promise.reject(error);
      });
  }

  // Helper function to handle response
  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }
}

export default Api;

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._handleResponse = this._handleResponse.bind(this);
  }

  _request(endpoint, options = {}) {
    const finalOptions = {
      headers: this._headers,
      ...options,
    };
    return fetch(`${this._baseUrl}${endpoint}`, finalOptions).then(
      this._handleResponse
    );
  }

  // Method to fetch user info
  getUserInfo() {
    return this._request("/users/me");
  }

  // Method to fetch cards
  getInitialCards() {
    return this._request("/cards");
  }

  // Method to edit user info
  editUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  // Method to create a new card
  createCard(data) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: "DELETE",
    });
  }

  addLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, {
      method: "PUT",
    });
  }

  removeLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, {
      method: "DELETE",
    });
  }

  editUserAvatar(avatar) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
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

  handleSubmit(action, data, button) {
    const originalText = button.textContent;
    button.textContent = "Saving...";
    button.disabled = true;

    const actionMap = {
      editProfile: () => this.editUserInfo(data),
      addCard: () => this.createCard(data),
      updateAvatar: () => this.editUserAvatar(data),
    };

    return actionMap[action]()
      .then((result) => {
        button.textContent = originalText;
        button.disabled = false;
        return result;
      })
      .catch((err) => {
        button.textContent = originalText;
        button.disabled = false;
        throw err;
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

class Query {
  constructor(dataPath) {
    this.#dataPath = dataPath;
  }

  #dataPath;

  async getData() {
    try {
      const arr = await $.getJSON(this.#dataPath);
      return arr;
    } catch (error) {
      console.error("Connection error detected.");
    }
  }

  async postData(data) {
    try {
      await $.post(this.#dataPath, data);
    } catch (error) {
      console.error("Connection error detected.");
    }
  }

  async putData(id, dataObj) {
    try {
      const jsonData = JSON.stringify(dataObj);
      const path = (this.#dataPath + "/" + id);
      await $.ajax({
        url: path,
        method: "put",
        contentType: "application/json",
        data: jsonData,
      })
    } catch (error) {
      console.error("Connection error detected.");
    }
  }

  async delete(id) {
    try {
      const path = (this.#dataPath + "/" + id);
      await $.ajax(path, { type: "DELETE" });
    } catch (error) {
      console.error("Connection error detected.");
    }
  }
}

export { Query };
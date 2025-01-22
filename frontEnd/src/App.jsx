import { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      newNote: "", // Added state for the new note input
    };
  }

  API_URL = "http://localhost:3000"; // Updated URL protocol to http

  componentDidMount() {
    this.refreshNotes();
  }

  async refreshNotes() {
    try {
      const response = await fetch(`${this.API_URL}/api/v1/todoApp/getNotes`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      this.setState({ notes: data });
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    }
  }

  async addClick() {
    const { newNote } = this.state;
    if (!newNote.trim()) {
      alert("Please enter a note before adding.");
      return;
    }

    try {
      const data = new FormData();
      data.append("newNotes", newNote);

      const response = await fetch(`${this.API_URL}/api/v1/todoApp/Addnote`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Note added successfully!");
        this.setState({ newNote: "" });
        this.refreshNotes();
      } else {
        alert(result.error || "Failed to add note.");
      }
    } catch (error) {
      console.error("Error adding note:", error.message);
      alert("An error occurred while adding the note.");
    }
  }

  async deleteClick(id) {
    try {
      const response = await fetch(
        `${this.API_URL}/api/v1/todoApp/DeleteNote?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Note deleted successfully!");
        this.refreshNotes();
      } else {
        alert(result.error || "Failed to delete note.");
      }
    } catch (error) {
      console.error("Error deleting note:", error.message);
      alert("An error occurred while deleting the note.");
    }
  }

  render() {
    const { notes, newNote } = this.state;
    return (
      <div className="App">
        <h1>ToDo App</h1>
        <div>
          <input
            type="text"
            value={newNote}
            onChange={(e) => this.setState({ newNote: e.target.value })}
            placeholder="Enter a new note"
          />
          <button onClick={() => this.addClick()}>Add Note</button>
        </div>
        <div>
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <div key={index} className="note">
                <h3>* {note.description}</h3>
                <button onClick={() => this.deleteClick(note.id)}>
                  Delete Note
                </button>
              </div>
            ))
          ) : (
            <p>No notes available.</p>
          )}
        </div>
      </div>
    );
  }
}

export default App;

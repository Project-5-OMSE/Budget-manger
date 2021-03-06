import React, { Component } from "react";
import Sidebar from "./sidebar";
import "../../Style/Dashboard.css";
import axios from "axios";
import Row from "./Row";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Mohammad Obeidat",
      balance: 0,
      currency: "JD",
      expenses: [],
      userExpenses: [],
      newExpense: {
        date: "",
        title: "",
        value: ""
      }
    };

    this.userData = this.props.userData;
  }

  componentWillMount() {
    let userData = this.props.userData;
    if (!userData) return;
    let data = userData[0];
    this.setState({ userExpenses: data.expenses });
  }

  componentDidMount() {
    this.userData && this.getExpenses();
  }

  //@METHOD GET
  //Return All Expenses From Database.
  getExpenses = () => {
    // this.state.userExpenses.map(expenseID => {
    axios
      .get(`/expenses/${this.userData[0]._id}`)
      .then(response => {
        console.log("RESPONSE.DATA.EXPENSES :", response.data);
        this.setState({
          balance: response.data.balance,
          saving: response.data.saving,
          expenses: response.data.expenses
        });
      })
      .catch(error => {
        console.log("NO DATA FETCHED :", error);
      });
    // })
  };

  //@METHOD POST
  //Add New Expense to Database.
  //ADD FUNCTIONALITY WORKS BUT DID NOT RENDER ANY THING AFTER DELETE :(
  addExpenses = (newExpense, clearInputs) => {
    // newExpense.date = Date.now();
    console.log(this.refs.dateAdded.value);
    newExpense.user_id = this.props.userData[0]._id; //Create New Key In 'newExpense Object' then assign to it The user id that come from "props.userData".
    newExpense.date = this.refs.dateAdded.value;
    // console.log("NEW EXPENSE :", newExpense);

    axios
      .post("/expenses", newExpense)
      .then(response => {
        console.log("RESPONSE FORM ADD EXPENSES :", response.data);
        this.setState({
          expenses: response.data.expenses,
          balance: response.data.balance,
          saving: response.data.saving
        });
      })
      .catch(error => {
        console.log("NO DATA FETCHED :", error);
      });
    clearInputs();
  };

  //@METHOD POST
  //Update User Salary
  addSalaryHandler = () => {
    // console.log(this.props.userData[0]._id);
    axios
      .post("/salary", { id: this.props.userData[0]._id })
      .then(response => {
        // console.log(response.data);
        let x = response.data[0].balance;
        let y = response.data[0].saving;
        this.setState({ balance: x, saving: y });
      })
      .catch(error => {
        console.log("NO DATA FETCHED :", error);
      });
  };

  //@METHOD DELETE
  //Delete Specific Expense From Database.
  //DELETE FUNCTIONALITY WORKS BUT DID NOT RENDER ANY THING AFTER DELETE :(
  deleteExpense = (expenseID, value) => {
    // debugger;
    const userID = this.props.userData[0]._id;
    axios
      .delete(`/delete/${expenseID}/${userID}`)
      .then(response => {
        console.log("RESULT FROM DELETE REACT", response);
        this.setState({
          expenses: response.data.expenses,
          balance: response.data.balance
        });
      })
      .catch(error => {
        console.log("NO DATA FETCHED", error);
      });
  };

  //Store Input values In State
  handleChange = event => {
    this.setState({
      newExpense: {
        ...this.state.newExpense, // Copy The Entire Object In That State.
        [event.target.name]: event.target.value // Change Name And Value Depend On Input Change Status.
      }
    });
  };

  //Clear Input Fields After Adding New Expense.
  clearInputs = () => {
    this.setState({
      // Change Value Of Specific Keys in Key inside State.
      newExpense: {
        date: "",
        title: "",
        value: ""
      }
    });
  };

  handleAdd = event => {
    event.preventDefault();
    // console.log("asdasd:", this.props);
    this.addExpenses(this.state.newExpense, this.clearInputs);
  };

  render() {
    // console.log(this.props.userData);
    // console.log("EXPENSES FROM RENDER", this.state.expenses);
    // console.log("USER EXPENSES FROM RENDER", this.state.userExpenses);
    const { date, title, value } = this.state.newExpense;
    return (
      <div className="body">
        <Sidebar />
        <div className="user-info">
          <h1 className="user-name">
            {this.props.userData
              ? this.props.userData[0].name
              : this.props.history.push("/login")}
          </h1>
          <h4 className="balance">
            {this.props.userData
              ? `Current Balance: ${this.state.balance} ${this.props.userData[0].currency}`
              : ""}
          </h4>
          <h4 className="balance">
            {this.props.userData
              ? `Saving: ${this.state.saving} ${this.props.userData[0].currency}`
              : ""}
          </h4>
        </div>

        {/* Add Expense Form */}
        <div className="form-container">
          {/* DATE PICKER COMPONENT */}
          <vaadin-date-picker
            value={date}
            className="date-picker"
            placeholder="Pick a date"
            ref="dateAdded"
          ></vaadin-date-picker>

          <div className="input-container">
            <label className="title-label" id="basic-addon1">
              Expense
            </label>
            <input
              onChange={this.handleChange}
              value={title}
              type="text"
              className="form-control"
              name="title"
              placeholder="Enter the title"
            />
          </div>

          <div className="input-container">
            <label className="title-label" id="basic-addon1">
              Value
            </label>
            <input
              onChange={this.handleChange}
              value={value}
              type="number"
              className="form-control"
              name="value"
              placeholder="Enter the value"
            />
          </div>

          <button
            className="add-expense"
            onClick={this.handleAdd}
            type="button"
          >
            {" "}
            Add Expense{" "}
          </button>
        </div>
        {/* End Of Add Expense Form */}

        <div className="add-payment">
          <img src={require("../../Assets/cash.svg")} alt="" />
          <button onClick={this.addSalaryHandler}> Salary Deposit</button>
        </div>

        {this.state.expenses.length === 0 ? (
          <img
            className="empty"
            src={require("../../Assets/empty.svg")}
            alt=""
          />
        ) : (
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <td scope="col">Date</td>
                <td scope="col">Title</td>
                <td scope="col">Value</td>
                <td scope="col">Delete</td>
              </tr>
            </thead>
            <tbody>
              {this.state.expenses.map(element => (
                <Row
                  key={element._id}
                  expenses={element}
                  edit={this.updateExpenses}
                  remove={this.deleteExpense}
                  user={this.state._id}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default Dashboard;

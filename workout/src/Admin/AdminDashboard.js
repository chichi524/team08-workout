import React from "react";
import "./Admin.css";
import { Line } from "react-chartjs-2";

import { getAllUsers } from "../actions/user";
import { getAllPosts } from "../actions/post";

const current = new Date();
const prevWeek = new Date();
prevWeek.setDate(current.getDate() - 9);
const dateLabels = [];

for (var i = prevWeek; i < current; i.setDate(i.getDate() + 1)) {
  var date = new Date(i).toISOString().split("T")[0];
  dateLabels.push(date);
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      posts: [],
      data: [],
    };
    this.generateData = this.generateData.bind(this);
  }

  generateData() {
    const userData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const postData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let userdate;
    for (let j = 0; j < this.state.users.length; j++) {
      userdate = this.state.users[j].datecreated;
      if (userdate) {
        let x = dateLabels.indexOf(userdate.split("T")[0]);
        if (x > -1) userData[x]++;
      }
    }

    let postdate;
    for (let k = 0; k < this.state.posts.length; k++) {
      postdate = this.state.posts[k].datecreated;
      if (postdate) {
        let x = dateLabels.indexOf(postdate.split("T")[0]);
        if (x > -1) postData[x]++;
      }
    }
    this.setState({
      data: [
        {
          label: "New users",
          data: userData,
          backgroundColor: ["rgba(0, 99, 163, 0.2)"],
          borderColor: ["rgba(0, 99, 163, 1)"],
        },
        {
          label: "New posts",
          data: postData,
          backgroundColor: ["rgba(75, 192, 255, 0.2)"],
          borderColor: ["rgba(75, 192, 255, 1)"],
        },
      ],
    });
  }

  componentDidMount() {
    const myPromise = new Promise((resolve, reject) => {
      resolve(getAllUsers(this) && getAllPosts(this));
    }).then(console.log(this.state.users))
    
    myPromise.then(() => this.generateData())
  }
  render() {
    return (
      <div className="adminContent">
        <h1>Dashboard</h1>
        <h2>
          There have been{" "}
          <span className="userCount">
            {
              this.state.users.filter(
                (user) =>
                  user.datecreated &&
                  user.datecreated.split("T")[0] === dateLabels[9]
              ).length
            }
          </span>{" "}
          new users and{" "}
          <span className="newPostCount">
            {" "}
            {
              this.state.posts.filter(
                (post) =>
                  post.datecreated &&
                  post.datecreated.split("T")[0] === dateLabels[9]
              ).length
            }
          </span>{" "}
          new posts today.
        </h2>
        Below are the statistics for the new users and new posts that have been
        created over the past 10 days.
        <br /> <br /> <br /> <br />
        <div>
          <Line
            data={{
              labels: dateLabels,
              datasets: this.state.data,
            }}
            height={500}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                xAxes: [
                  {
                    display: true,
                    type: "time",
                    time: {
                      parser: "YYYY-MM-DD",
                      unit: "day",
                      unitStepSize: 1,
                      displayFormats: {
                        day: "DD/MM/YYYY",
                      },
                    },
                  },
                ],
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      callback: function (value) {
                        if (value % 1 === 0) {
                          return value;
                        }
                      },
                    },
                  },
                ],
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default Dashboard;
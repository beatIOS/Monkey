import React, {Component} from 'react';
import './App.css';
import {Games} from './data/Games';
import {Users} from './data/Users';
import {Hosts} from './data/Hosts';
import {Monkey} from './monkey/Monkey';

class Game extends Component {
  constructor(props) {
    super(props);

    this.gameList = Games.map((game) => <option key={game.name} value={game.name}>{game.name}</option>);
    this.userList = Users.map((user) => <option key={user} value={user}>{user}</option>);
    this.hostList = Hosts.map((host) => <option key={host} value={host}>{host}</option>);

    this.state = {
      game:         Games[0].name,
      user:         Users[0],
      host:         Hosts[0],
      cycles:       10000,
      numBaseGames: 0,
      numFreeGames: 0,
      betPerLine:   2,
      totalWager:   0,
      totalWin:     0,
      errors:       0,
      startTime:    null,
      message:      'Idle'
    };

    this.handleGameChange   = this.handleGameChange.bind(this);
    this.handleUserChange   = this.handleUserChange.bind(this);
    this.handleHostChange   = this.handleHostChange.bind(this);
    this.handleCyclesChange = this.handleCyclesChange.bind(this);
    this.handleBetChange    = this.handleBetChange.bind(this);
    this.handleSubmit       = this.handleSubmit.bind(this);
  }

  getGameID() {
    for (let i = 0, n = Games.length; i < n; i++) {
      const game = Games[i];
      if (game.name === this.state.game) {
        return game.id;
      }
    }
  }

  getStartTime() {
    if (!this.state.startTime) return null;
    return this.state.startTime.toTimeString();
  }

  getRTP() {
    if (this.state.totalWager === 0) return '';
    const rtp = this.state.totalWin / this.state.totalWager;
    return (Math.round(rtp * 10000) / 100).toFixed(2) + '%';
  }

  handleGameChange(event) {
    this.setState({game: event.target.value});
  }

  handleUserChange(event) {
    this.setState({user: event.target.value});
  }

  handleHostChange(event) {
    this.setState({host: event.target.value});
  }

  handleCyclesChange(event) {
    this.setState({cycles: event.target.value});
  }

  handleBetChange(event) {
    this.setState({betPerLine: event.target.value});
  }

  handleSubmit(event) {
    this.setState({
      startTime: new Date(),
      message:   'Monkey test in progress!',
    });
    this.monkey = new Monkey(this, this.state.cycles, this.getGameID(), this.state.user, this.state.host);
    this.monkey.start();
    event.preventDefault();
  }

  updateStatus() {
    this.setState({
      numBaseGames: this.monkey.numBaseGames,
      numFreeGames: this.monkey.numFreeGames,
      totalWager:   this.monkey.totalBet,
      totalWin:     this.monkey.totalWin,
      errors:       this.monkey.errCount
    });
  }

  onStopped(msg) {
    this.updateStatus();
    this.setState({
      message: msg,
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>
          <label>
            Game:
            <select value={this.state.game} onChange={this.handleGameChange}>
              {this.gameList}
            </select>
          </label>
          <label>
            User:
            <select value={this.state.user} onChange={this.handleUserChange}>
              {this.userList}
            </select>
          </label>
          <label>
            Host:
            <select value={this.state.host} onChange={this.handleHostChange}>
              {this.hostList}
            </select>
          </label>
          <label>
            Cycles:
            <input type="text" value={this.state.cycles} onChange={this.handleCyclesChange}/>
          </label>
          <label>
            Bet Per Line:
            <input type="text" value={this.state.betPerLine} onChange={this.handleBetChange}/>
          </label>
          <input type="submit" value="Start Monkey"/>
        </p>
        <p>
          <label>
            Game ID: {this.getGameID()}
          </label>
        </p>
        <p>
          <label>
            Start Time: {this.getStartTime()}
          </label>
        </p>
        <p>
          <label>
            Number of base games played: {this.state.numBaseGames}
          </label>
        </p>
        <p>
          <label>
            Number of free games played: {this.state.numFreeGames}
          </label>
        </p>
        <p>
          <label>
            Total Wager: {this.state.totalWager}
          </label>
        </p>
        <p>
          <label>
            Total Win: {this.state.totalWin}
          </label>
        </p>
        <p>
          <label>
            RTP: {this.getRTP()}
          </label>
        </p>
        <p>
          <label>
            Errors: {this.state.errors}
          </label>
        </p>
        <p>
          <label>
            Status: {this.state.message}
          </label>
        </p>
      </form>
    );
  }
}

export default Game;

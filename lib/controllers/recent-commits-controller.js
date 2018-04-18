import React from 'react';
import PropTypes from 'prop-types';

import RecentCommitsView from '../views/recent-commits-view';

export default class RecentCommitsController extends React.Component {
  static propTypes = {
    commits: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool.isRequired,
    undoLastCommit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      emailAvatars: {},
    };
  }

  componentDidMount() {
    this.loadAvatars();
  }

  componentDidUpdate() {
    this.loadAvatars();
  }

  loadAvatars() {
    const authorEmails = this.props.commits.reduce((emailSet, commit) => {
      emailSet.add(commit.getAuthorEmail());
      commit.getCoAuthors().forEach(author => { emailSet.add(author.email); });
      return emailSet;
    }, new Set());
    console.log('loadAvatars', authorEmails);

    authorEmails.forEach(email => {
      if (this.state.emailAvatars[email]) {
        console.log(email, 'exists');
        return;
      }

      const img = new Image();
      img.addEventListener('load', () => {
        console.log('load', email);
        this.setState(state => ({
          emailAvatars: {
            ...state.emailAvatars,
            [email]: `https://avatars.githubusercontent.com/u/e?email=${encodeURIComponent(email)}&s=32`,
          },
        }));
      });
      img.src = `https://avatars.githubusercontent.com/u/e?email=${encodeURIComponent(email)}&s=32`;
    });
  }

  render() {
    return (
      <RecentCommitsView
        commits={this.props.commits}
        isLoading={this.props.isLoading}
        undoLastCommit={this.props.undoLastCommit}
        emailAvatars={this.state.emailAvatars}
      />
    );
  }
}

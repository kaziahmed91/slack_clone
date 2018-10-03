import React from 'react';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import findIndex from 'lodash/findIndex';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/team';


/** 
 *  LEARNING: This is the mother-parent component that runs on top [
 *  Viewteam is a page that is rendered in routes/index.js
 *  The following params are available as props passed by router before destructuring below:
 *  1) DATA, 2) HISTORY, 3) MATCH 4) LOCATION
 *  The following destructuring allows us to get query string
 */ 


const ViewTeam = ({ data: { loading, allTeams }, match: { params: { teamId, channelId } } }) => {


  if (loading) {
    return null;
  }

  if (!allTeams.length) { // If the user does not belong to any team. 
    return (<Redirect to="/createTeam" />);
  }

  const teamIdInt = parseInt(teamId, 10); // Check to see if the id is always an integer
  const teamIdx = teamIdInt ? findIndex(allTeams, ['id', teamIdInt]) : 0;
  const team = allTeams[teamIdx];

  const channelIdInt = parseInt(channelId, 10); 
  const channelIdx = channelIdInt ? findIndex(team.channels, ['id', channelIdInt]) : 0;
  const channel = team.channels[channelIdx];
  // console.log(teamId, teamIdx, team, channelId, channel);

  return (
    
    <AppLayout>
      <Sidebar
        teams={allTeams.map(t => ({ id: t.id, letter: t.name.charAt(0).toUpperCase() }))}
        team={team}
      />
      {/* { The following is like a ternary: channel ? <header></header> : null } */}
      {channel && <Header channelName={channel.name} />} 
      {channel && (<Messages channelId={channel.id}>
        <ul className="message-list">
          <li />
          <li />
        </ul>
      </Messages>)}
      <SendMessage channelName={channel.name} />
    </AppLayout>
  );
};


export default graphql(allTeamsQuery)(ViewTeam);
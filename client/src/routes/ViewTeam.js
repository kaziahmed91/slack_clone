import React from 'react';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import findIndex from 'lodash/findIndex';
import Header from '../components/Header';
import MessageContainer from '../containers/MessageContainer'
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

const ViewTeam = ({ 
  data: { loading, allTeams, inviteTeams }, 
  match: { params: { teamId, channelId } } }) => {

    
  if (loading) {
    return null;
  }
  // console.log(allTeams, inviteTeams)
  const teams = [...allTeams, ...inviteTeams]
  // console.log(teams)
  /**
   * The following is a validation for correct team id and channel id being passed as query params
   */
  // If we create a new user, and the user does not belong to a new team, we want a redirect
  if (!teams.length) { // If the user does not belong to any team. 
    return (<Redirect to="/createTeam" />);
  }

  const teamIdInt = parseInt(teamId, 10); // Check to see if the id is always an integer
  const teamIdx = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0; // if not integer then its 0
  const team = teamIdx === -1  ? teams[0] : teams[teamIdx];
  
  const channelIdInt = parseInt(channelId, 10);  // check to see if channel integer
  const channelIdx = channelIdInt ? findIndex(team.channels, ['id', channelIdInt]) : 0; // if not then 0
  const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];
  // console.log(teamId, teamIdx, team, channelId, channel);

  return (
    
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({ id: t.id, letter: t.name.charAt(0).toUpperCase() }))}
        team={team}
      />
      {/* { The following is like a ternary: channel ? <header></header> : null } */}
      {channel && <Header channelName={channel.name} />} 
      {channel && <MessageContainer channelId={channel.id} />}
      {channel && <SendMessage channelName={channel.name} channelId={channel.id} />}
    </AppLayout>
  );
};


export default graphql(allTeamsQuery)(ViewTeam);
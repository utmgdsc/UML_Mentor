import React from 'react';
import styled from 'styled-components';

interface UserInfoProps {
  username: string;
  score: number;
}

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: Arial, sans-serif;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  font-weight: bold;
  color: #333;
`;

const Score = styled.span`
  font-size: 0.8em;
  color: #666;
`;

const UserInfo: React.FC<UserInfoProps> = ({ username, score }) => {
  return (
    <UserInfoContainer>
      <Avatar>
        <img 
          src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${username}`} 
          alt={`${username}'s avatar`}
        />
      </Avatar>
      <UserDetails>
        <Username>{username}</Username>
        <Score>{score}</Score>
      </UserDetails>
    </UserInfoContainer>
  );
};

export default UserInfo;
import React from 'react';
import { Image } from 'react-bootstrap';

interface AvatarProps {
  username: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ username, size = 40 }) => {
  return (
    <Image
      src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${username}`}
      roundedCircle
      width={size}
      height={size}
      alt={`${username}'s avatar`}
    />
  );
};

export default Avatar;
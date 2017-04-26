export default function formatUser(user) {
  switch (user.type) {
    case 'ADMIN':
    case 'STUDENT':
    case 'LEADER':
    case 'TEACHER':
    default:
      return user.toJSON();
  }
}

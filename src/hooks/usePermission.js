import { useSelector } from 'react-redux'
import { selectPermissions } from '../features/auth/authSlice'

export const usePermission = () => {
  const permissions = useSelector(selectPermissions)

  const can = (permission) => permissions.includes(permission)

  return { permissions, can }
}

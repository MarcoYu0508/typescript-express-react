import api from "./api";
import TokenService from "./token";

const home = async () => {
  const res = await api.get('');
  return res.data;
}

const users = async () => {
  const res = await api.get('/users');
  return res.data;
}

const createUser = async (name, account, password, role) => {
  const res = await api.post('/user/create', { name, account, password, role });
  return res.data;
}

const deleteUser = async (id) => {
  const res = await api.delete('/user/delete', { data: { id } });
  return res.data;
}

const handleError = (err) => {
  if (err.response.data !== undefined) {
    if (err.response.data.errors) {
      const errors = err.response.data.errors;
      let errorsMessage = "";
      for (const key in errors) {
        errorsMessage += `${errors[key]}\n`;
      }
      return errorsMessage;
    } else {
      return err.response.data;
    }
  }
}

const leave = () => {
  TokenService.removeToken();
}

const DataService = {
  home,
  leave,
  users,
  createUser,
  deleteUser,
  handleError
}

export default DataService;
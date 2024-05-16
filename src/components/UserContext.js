import supabase from "../config/supabaseClient";

const UserContext = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          console.log(value.data.user);
          setUser(value.data.user);
        }
      });
    }
    getUserData();
  }, []);
};

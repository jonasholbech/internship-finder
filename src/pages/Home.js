import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader } from "rsuite";
import InternshipCard from "../components/InternshipCard";
import FavouriteCard from "../components/FavouriteCard";
import { supabase } from "../contexts/auth";
import useAuth from "../hooks/useAuth";
import { usePersonalFavourites } from "../hooks/useData";

function Home() {
  const { favourites, loadingFav, errorFav } = usePersonalFavourites();

  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  let { auth } = useAuth();
  useEffect(() => {
    getReviews();
  }, [auth.auth]);

  const getReviews = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      //console.log(user);
      let { data, error, status } = await supabase
        .from("internships")
        .select(
          `id, rating, ended, description, companies (
          name
        )`
        )
        .eq("user_id", user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setInternships(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="Home">
      <section className="favourites">
        <h2>My Favourites</h2>
        {loadingFav && <Loader />}
        {errorFav && (
          <p className="error">
            There was a problem loading your favourites, try agin
          </p>
        )}
        {favourites.length === 0 && (
          <p className="full">
            You have not favourited any companies yet, why don't you{" "}
            <Link to="/reviews">add one</Link>?
          </p>
        )}
        {favourites.map((it) => {
          return <FavouriteCard key={it.id} {...it} />;
        })}
      </section>
      <section className="reviews">
        <h2>My Reviews</h2>
        {loading && <Loader />}
        {internships.length === 0 && (
          <p className="full">
            You have not reviewed an internship yet, why don't you{" "}
            <Link to="/add-review">add one</Link>?
          </p>
        )}
        {internships.map((it) => {
          return <InternshipCard key={it.id} {...it} />;
        })}
      </section>
    </div>
  );
}

export default Home;

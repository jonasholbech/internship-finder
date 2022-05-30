import { useState, useEffect } from "react";
import { supabase } from "../contexts/auth";
export function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("companies")
          .select(`*`);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setCompanies(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getCompanies();
  }, []);
  return { companies, loading, error };
}

export function usePersonalFavourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFavourites = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase.from("favourites")
          .select(`id, companies(
                name
            )`);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setFavourites(
            data.map((item) => {
              return {
                id: item.id,
                name: item.companies.name,
              };
            })
          );
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getFavourites();
  }, []);
  return { favourites, loading, error };
}

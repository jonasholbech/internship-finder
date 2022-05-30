import { useState } from "react";
import {
  InputPicker,
  DatePicker,
  Rate,
  Input,
  Button,
  Message,
  toaster,
} from "rsuite";
import { supabase } from "../contexts/auth";
import useAuth from "../hooks/useAuth";
import { useCompanies } from "../hooks/useData";
const message = (
  <Message showIcon type="success">
    <p>Thank you</p>
  </Message>
);
function AddReview() {
  const { auth } = useAuth();
  const { companies, loading, error } = useCompanies();
  const [company, setCompany] = useState("");
  const [companyError, setCompanyError] = useState(null);
  const [end, setEnd] = useState(null);
  const [endError, setEndError] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(null);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);

  async function add(e) {
    e.preventDefault();
    let error = false;
    if (!company) {
      setCompanyError("Please select a company");
      error = true;
    }

    if (!end) {
      setEndError("Please select an end date");
      error = true;
    }
    if (!rating) {
      setRatingError("Please select at least one star");
      error = true;
    }
    if (!description) {
      setDescriptionError("Please add a description");
      error = true;
    }

    //if input picket vaslue is not numeric, it's a new company
    if (!error) {
      let company_id = company;
      //TODO reverse logic, look up name first, then create it
      if (!Number.isInteger(company)) {
        const { data, error } = await supabase
          .from("companies")
          .insert({ user_id: auth.user.id, name: company });
        if (data) {
          company_id = data[0].id;
        }

        if (error?.code === "23505") {
          //duplicate entry
          const { data } = await supabase
            .from("companies")
            .select("id")
            .eq("name", company);
          company_id = data[0].id;
          console.log("duplicate entry, found new id:", data);
        }
      }
      /* const { data, error } =  */ await supabase.from("internships").insert([
        {
          user_id: auth.user.id,
          ended: end,
          rating,
          company_id: company_id,
          description,
        },
      ]);
      //TODO: error handling on insert
      toaster.push(message);
      setCompany("");
      setCompanyError(null);
      setEnd(null);
      setEndError(null);
      setRating(0);
      setRatingError(null);
      setDescription("");
      setDescriptionError(null);
    }
  }

  if (loading) {
    return <p>Loading</p>;
  }
  return (
    <div className="AddReview">
      {error && (
        <Message type="error">
          There was an error loading the companies, could you try again?
        </Message>
      )}
      <form onSubmit={add}>
        <div className="form-control">
          <label htmlFor="form_company">Company</label>
          <InputPicker
            creatable
            id="form_company"
            value={company}
            onChange={setCompany}
            onFocus={() => setCompanyError(null)}
            data={companies.map((c) => ({ label: c.name, value: c.id }))}
            style={{ width: 224 }}
          />
          {companyError && <p className="error">{companyError}</p>}
        </div>

        <div className="form-control">
          <label htmlFor="form_end">End</label>
          <DatePicker
            value={end}
            id="form_end"
            onChange={setEnd}
            oneTap
            placeholder="yyyy-mm"
            format="yyyy-MM"
            style={{ width: 200 }}
            onFocus={() => setEndError(null)}
          />
          {endError && <p className="error">{endError}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="form_rating">Rating</label>
          <Rate
            id="form_rating"
            value={rating}
            onChange={setRating}
            /* defaultValue={0} */ color="blue"
            onFocus={() => setRatingError(null)}
          />
          {ratingError && <p className="error">{ratingError}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="form_description">Description</label>
          <Input
            as="textarea"
            id="form_description"
            rows={3}
            value={description}
            onChange={setDescription}
            placeholder="Atmosphere? Tasks? Friday bar?"
            onFocus={() => setDescriptionError(null)}
          />
          {descriptionError && <p className="error">{descriptionError}</p>}
        </div>

        <Button type="submit" appearance="primary">
          Add review
        </Button>
      </form>
    </div>
  );
}

export default AddReview;

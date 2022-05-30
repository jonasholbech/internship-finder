import { useState, useEffect } from "react";
import { Table, Modal, Button } from "rsuite";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsHeartHalf } from "react-icons/bs";
import { Link } from "react-router-dom";
import sortBy from "just-sort-by";
import { supabase } from "../contexts/auth";
import useAuth from "../hooks/useAuth";
const Column = Table.Column;
const HeaderCell = Table.HeaderCell;
const Cell = Table.Cell;
const DescriptionModal = ({ open, handleClose, name, description }) => {
  return (
    <div className="modal-container">
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
const FavCell = ({ rowData, dataKey, setForceLoad, ...props }) => {
  let { auth } = useAuth();
  async function click(e) {
    e.stopPropagation();
    if (rowData.fav) {
      /* const { data, error } =  */ await supabase
        .from("favourites")
        .delete()
        .match({ company_id: rowData.company_id });
    } else {
      /* let { data, error } =  */ await supabase
        .from("favourites")
        .insert({ company_id: rowData.company_id, user_id: auth.user.id });
    }
    setForceLoad(Date.now());
  }
  return (
    <Cell {...props} onClick={click}>
      {rowData.fav ? <AiFillHeart /> : <AiOutlineHeart />}
    </Cell>
  );
};
function Reviews() {
  const [loading, setLoading] = useState(false);
  const [internships, setInternships] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [forceLoad, setForceLoad] = useState(Date.now());
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let { auth } = useAuth();
  useEffect(() => {
    getReviews();
  }, [auth.auth, forceLoad]);
  const getData = () => {
    if (sortColumn && sortType) {
      const sorted = sortBy(internships, sortColumn);
      if (sortType !== "asc") {
        sorted.reverse();
      }
      return sorted;
    }
    return internships;
  };
  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };
  const getReviews = async () => {
    try {
      setLoading(true);
      let { data, error, status } = await supabase.from("internships").select(
        `id, rating, ended, description, companies (
          name, id, favourites (id)
        )`
      );

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        const next = data.map((item) => ({
          ...item,
          ended: item.ended.slice(0, 7),
          name: item.companies.name,
          fav: item.companies.favourites.length > 0,
          company_id: item.companies.id,
        }));
        setInternships(next);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  //TODO: read table docs
  return (
    <div className="Reviews  fullbleed">
      <DescriptionModal
        open={open}
        handleClose={handleClose}
        name={modalTitle}
        description={modalBody}
      />
      <section className="reviews">
        <h2>All Reviews</h2>
        {internships.length === 0 && (
          <p>
            There are no reviews yet, <Link to="/add-review">add one</Link>?
          </p>
        )}

        <Table
          data={getData()}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
          loading={loading}
          autoHeight={true}
          onRowClick={(data) => {
            setModalTitle(data.name);
            setModalBody(data.description);
            handleOpen();
          }}
        >
          <Column width={60} sortable>
            <HeaderCell>
              <BsHeartHalf />
            </HeaderCell>
            <FavCell setForceLoad={setForceLoad} dataKey="fav" />
          </Column>

          <Column sortable>
            <HeaderCell>Company</HeaderCell>
            <Cell dataKey="name" />
          </Column>

          <Column width={80} sortable>
            <HeaderCell>Rating</HeaderCell>
            <Cell dataKey="rating" />
          </Column>

          <Column width={90} sortable>
            <HeaderCell>Ended</HeaderCell>
            <Cell dataKey="ended" />
          </Column>

          <Column width={200} className="description-col">
            <HeaderCell>Description</HeaderCell>
            <Cell dataKey="description" />
          </Column>
        </Table>
      </section>
    </div>
  );
}

export default Reviews;

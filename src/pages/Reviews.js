import { useState, useEffect } from "react";
import { Table, Modal, Button } from "rsuite";
import { Link } from "react-router-dom";
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
function Reviews() {
  const [loading, setLoading] = useState(false);
  const [internships, setInternships] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let { auth } = useAuth();
  useEffect(() => {
    getReviews();
  }, [auth.auth]);
  const getData = () => {
    if (sortColumn && sortType) {
      return internships.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
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
          name
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
          short: item.description.slice(0, 50) + "...",
        }));
        setInternships(next);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  //TODO: read table docs,. modal on click with full description
  return (
    <div className="Reviews">
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
          onRowClick={(data) => {
            setModalTitle(data.name);
            setModalBody(data.description);
            handleOpen();
          }}
        >
          <Column width={130} sortable>
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

          <Column width={200}>
            <HeaderCell>Description</HeaderCell>
            <Cell dataKey="short" />
          </Column>
        </Table>
      </section>
    </div>
  );
}

export default Reviews;

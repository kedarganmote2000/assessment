import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const predefinedDetails = {
  job: 'Software Engineer',
  mobile: '123-456-7890',
  skill: 'React, JavaScript, HTML, CSS',
  education: 'Bachelor of Science in Computer Science',
  address: '123 Main St, City, Country',
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }

  th {
    cursor: pointer;
    background-color: #f2f2f2;
  }

  button {
    cursor: pointer;
    padding: 5px 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 3px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 2;

  p {
    margin: 5px 0;
  }

  button {
    margin-top: 10px;
    padding: 8px 15px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
`;

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const jsonData = await response.json();

        // Sort data by 'name' in ascending order initially
        const sortedData = jsonData.sort((a, b) =>
          a.name.toString().localeCompare(b.name.toString())
        );

        setData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortData = (columnName) => {
    let sortedData;
    if (columnName === 'name') {
      // Sort 'name' column in ascending order
      sortedData = [...filteredData].sort((a, b) =>
        a[columnName].toString().localeCompare(b[columnName].toString())
      );
    } else {
      // For other columns, sort in ascending order by default
      sortedData = [...filteredData].sort((a, b) =>
        a[columnName].toString().localeCompare(b[columnName].toString())
      );
    }
    setData(sortedData);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <Container>
      <SearchInput
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <thead>
          <tr>
            <th onClick={() => sortData('name')}>Name</th>
            <th onClick={() => sortData('email')}>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((profile) => (
            <tr key={profile.id}>
              <td>{profile.name}</td>
              <td>{profile.email}</td>
              <td>
                <button onClick={() => setSelectedProfile(profile)}>
                  Edit Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={endIndex >= filteredData.length}
        >
          Next
        </button>
      </Pagination>

      {selectedProfile && (
        <Modal>
          <h2>Edit Profile</h2>
          <p>Job: {predefinedDetails.job}</p>
          <p>Mobile: {predefinedDetails.mobile}</p>
          <p>Skill: {predefinedDetails.skill}</p>
          <p>Education: {predefinedDetails.education}</p>
          <p>Address: {predefinedDetails.address}</p>
          <button onClick={() => setSelectedProfile(null)}>Close</button>
        </Modal>
      )}
    </Container>
  );
}

export default App;

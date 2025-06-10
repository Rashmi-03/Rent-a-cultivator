import React from 'react';

const Dashboard = ({ username }) => {
  return (
    <div style={styles.page}>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>🚜 RENT-A-CULTIVATOR</h1>
        <p style={styles.subtitle}>
          Hello {username}, welcome to your tractor rental dashboard!
        </p>
        <p style={styles.description}>
          Explore a wide range of tractors suitable for all your farming needs. All models available on a rental basis.
        </p>
      </header>

      {/* Tractor Cards */}
      <div style={styles.imageContainer}>
        {/* Tractor 1 */}
        <div style={styles.card}>
          <img
            src="https://cdn.tractorsdekho.com/in/mahindra /255-di-power-plus/mahindra-255-di-power-plus-48822.jpg"
            alt="Mahindra 255 DI Power Plus"
            style={styles.tractorImage}
          />
          <p style={styles.caption}>Mahindra 255 DI Power Plus</p>
        </div>

        {/* Tractor 2 */}
        <div style={styles.card}>
          <img
            src="https://www.mahindratractor.com/sites/default/files/styles/958x863/public/2024-07/275-DI-TU-XP-Plus-desktop_3.webp?itok=VLLkyOT5"
            alt="Mahindra 275 DI TU"
            style={styles.tractorImage}
          />
          <p style={styles.caption}>Mahindra 275 DI TU</p>
        </div>

        {/* Tractor 3 */}
        <div style={styles.card}>
          <img
            src="https://tractor.cmv360.com/_next/image?url=https%3A%2F%2Fd1odgbsvvxl2qd.cloudfront.net%2Fsmall_MAHINDRA_475_DI_886b81d27c.jpg&w=3840&q=100"
            alt="Mahindra 475 DI"
            style={styles.tractorImage}
          />
          <p style={styles.caption}>Mahindra 475 DI</p>
        </div>
      </div>

      {/* Contact Section */}
      <footer style={styles.footer}>
        <h3>Contact Us</h3>
        <p>Email: support@rentacultivator.com</p>
        <p>Phone: +91-9876543210</p>
        <p>Location: MITE, Moodbidri, Karnataka</p>
        <p>We are here to help you 24/7 with your farming needs.</p>
      </footer>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    background: '#f9f9f9',
    minHeight: '100vh',
  },
  navbar: {
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    color: '#fff',
  },
  mahindraText: {
    color: '#e60000',
    fontWeight: 'bold',
    fontSize: '1rem',
    letterSpacing: '1px',
  },
  tractorsText: {
    fontWeight: 'bold',
    fontSize: '0.8rem',
  },
  toughTag: {
    backgroundColor: '#b22222',
    padding: '2px 6px',
    fontSize: '0.7rem',
    marginTop: '4px',
    borderRadius: '3px',
    display: 'inline-block',
  },
  navLinks: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  link: {
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  iconLink: {
    fontSize: '0.9rem',
    cursor: 'pointer',
    color: '#e60000',
  },
  header: {
    textAlign: 'center',
    margin: '40px 0 20px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#006400',
  },
  subtitle: {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#333',
  },
  description: {
    fontSize: '1rem',
    color: '#555',
    marginTop: '10px',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '30px',
    padding: '30px 0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '15px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '220px',
  },
  tractorImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  caption: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#004d00',
  },
  footer: {
    marginTop: '50px',
    textAlign: 'center',
    backgroundColor: '#dff0d8',
    padding: '20px',
    borderRadius: '8px',
    color: '#333',
  },
};

export default Dashboard;
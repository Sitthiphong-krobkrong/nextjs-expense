import Link from 'next/link';

const Navbar = () => (
    <nav style={styles.nav}>
        <div style={styles.logo}>
            <Link href="/" style={styles.link}>
                รายการค่าใช้จ่าย
            </Link>
        </div>
        <ul style={styles.navLinks}>
            <li>
                <Link href="/" style={styles.link}>
                    หน้าหลัก
                </Link>
            </li>
            <li>
                <Link href="/manage" style={styles.link}>
                    จัดการข้อมูล
                </Link>
            </li>
            <li>
                <Link href="/about" style={styles.link}>
                    เกี่ยวกับ
                </Link>
            </li>
        </ul>
    </nav>
);

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#222',
        color: '#fff',
    },
    logo: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    navLinks: {
        listStyle: 'none',
        display: 'flex',
        gap: '1.5rem',
        margin: 0,
        padding: 0,
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1rem',
    },
};

export default Navbar;

# Store Point of Sale

Desktop Point of Sale application built with Electron and Node.js

## Features

- Can be used by multiple PCs on a network with one central database
- Secure authentication with role-based access control (RBAC)
- First-run setup wizard (no default credentials)
- Receipt printing with automatic retry logic
- Search for products by barcode
- Staff accounts with customizable permissions (Owner, Manager, Cashier)
- Products and categories management
- Basic stock management
- Open tabs (orders)
- Customer database
- Transaction history
- Filter transactions by till, cashier, or status
- Filter transactions by date range
- Support for SQLite, MySQL, and PostgreSQL databases

## System Requirements

- Node.js LTS (v20 or higher)
- Windows 10/11 (primary support)
- Linux and macOS (experimental)
- Minimum 4GB RAM
- 500MB free disk space

## Quick Start (15-30 minutes)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Store-POS.git
cd Store-POS

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` file with your settings:

```env
# Application Settings
APP_PORT=3000
NODE_ENV=development

# Database Configuration (choose one)
DB_TYPE=sqlite                    # Options: sqlite, mysql, postgres
SQLITE_FILE=./data/store.db       # For SQLite only

# For MySQL or PostgreSQL:
# DB_TYPE=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_NAME=storepos
# DB_USER=store
# DB_PASSWORD=your_secure_password

# Security
JWT_SECRET=your_very_secure_random_string_at_least_32_characters

# Printer Configuration
PRINTER_NAME=Your_Printer_Name
PRINT_QUEUE_CONCURRENCY=1
PRINT_MAX_RETRY=3
PRINT_RETRY_DELAY_MS=1500
```

### 3. Database Setup

```bash
# Run migrations to create database tables
npm run db:migrate

# Seed initial roles and permissions
npm run db:seed
```

### 4. Run the Application

```bash
# Development mode
npm run electron

# The application will open automatically
# Follow the first-run setup wizard to create your owner account
```

## First-Run Setup

When you launch the application for the first time:

1. The setup wizard will automatically appear
2. Enter your full name, email, and a secure password
3. Password requirements:
   - Minimum 10 characters
   - Must contain uppercase and lowercase letters
   - Must contain at least one number
4. Click "Create Account" to initialize the system
5. You'll be redirected to the login screen
6. Log in with your new credentials

## Network Setup (Multi-Terminal)

To use Store POS across multiple computers on a network:

### 1. Choose a Central Database

**Option A: MySQL (Recommended for networks)**

```bash
# Install MySQL on your server computer
# Create a database:
CREATE DATABASE storepos;
CREATE USER 'storepos'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON storepos.* TO 'storepos'@'%';
FLUSH PRIVILEGES;
```

**Option B: PostgreSQL**

```bash
# Install PostgreSQL on your server computer
# Create a database:
CREATE DATABASE storepos;
CREATE USER storepos WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE storepos TO storepos;
```

### 2. Configure Each Terminal

On each POS terminal, edit `.env`:

```env
DB_TYPE=mysql
DB_HOST=192.168.1.100    # IP address of your database server
DB_PORT=3306
DB_NAME=storepos
DB_USER=storepos
DB_PASSWORD=secure_password
```

### 3. Run Setup

On the **first terminal only**:

```bash
npm run db:migrate
npm run db:seed
```

On all other terminals, just start the application:

```bash
npm run electron
```

## Database Management

### Migrations

```bash
# Apply all pending migrations
npm run db:migrate

# Rollback the last migration
npm run db:rollback
```

### Seeds

```bash
# Seed roles and permissions
npm run db:seed
```

## Backup and Restore

### SQLite

**Backup:**

```bash
# Stop the application first
# Then copy the database file
cp data/store.db data/backups/store_backup_$(date +%Y%m%d).db
```

**Restore:**

```bash
# Stop the application
# Copy backup file
cp data/backups/store_backup_20251018.db data/store.db
# Restart the application
```

### MySQL

**Backup:**

```bash
mysqldump -u storepos -p storepos > backup_$(date +%Y%m%d).sql
```

**Restore:**

```bash
mysql -u storepos -p storepos < backup_20251018.sql
```

### PostgreSQL

**Backup:**

```bash
pg_dump -U storepos storepos > backup_$(date +%Y%m%d).sql
```

**Restore:**

```bash
psql -U storepos storepos < backup_20251018.sql
```

## Building for Production

### Windows MSI Installer

```bash
npm run dist:win
```

The installer will be created in the `dist/` directory.

### Automated Releases

To create a release automatically:

1. Create a version tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

2. GitHub Actions will automatically build and upload the MSI to Releases

## Development

### Code Quality

```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing

```bash
# Run tests
npm test
```

## Troubleshooting

### Common Issues

**1. Printer Not Working**

- Verify `PRINTER_NAME` in `.env` matches your system printer name exactly
- Check printer is online and has paper
- Test print using the printer settings page in the app

**2. Port Already in Use**

- Change `APP_PORT` in `.env` to a different port (e.g., 3001)
- Restart the application

**3. Database Connection Failed**

- Verify database credentials in `.env`
- Ensure database server is running
- Check firewall settings allow connections on database port
- For network setup, ensure server IP is accessible from terminal

**4. Cannot Access on Network**

- Ensure database server has network access enabled
- Configure MySQL/PostgreSQL to accept remote connections
- Check firewall rules on database server
- Use static IP addresses, not DHCP

**5. Permission Denied Errors**

- Ensure the application has write permissions to the `data/` directory
- Run database migrations as a user with appropriate permissions

## Security Best Practices

- Change `JWT_SECRET` to a secure random string in production
- Use strong passwords for database users
- Never commit `.env` files to version control
- Keep all dependencies updated
- Restrict database access to authorized IPs only
- Regular backups of database
- Enable SSL/TLS for database connections in production

## Roles and Permissions

### Owner

- Full system access
- Manage users and assign roles
- View and modify all settings
- Access all features

### Manager

- View and manage products, categories, customers
- Create and view transactions
- Cannot manage users or system settings

### Cashier

- View products
- Create transactions (sales)
- View customers
- Limited access to reports

## Screenshots

![POS](https://github.com/tngoman/Store-POS/blob/master/screenshots/pos.jpg)

![Transactions](https://github.com/tngoman/Store-POS/blob/master/screenshots/transactions.jpg)

![Receipt](https://github.com/tngoman/Store-POS/blob/master/screenshots/receipt.jpg)

![Permissions](https://github.com/tngoman/Store-POS/blob/master/screenshots/permissions.jpg)

![Users](https://github.com/tngoman/Store-POS/blob/master/screenshots/users.jpg)

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please create an issue on GitHub.

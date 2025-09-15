Expected MySQL tables for this API (created by the database container's init scripts):

- categories:
  - id INT AUTO_INCREMENT PRIMARY KEY
  - name VARCHAR(100) NOT NULL
  - color VARCHAR(20) NULL
  - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

- tasks:
  - id INT AUTO_INCREMENT PRIMARY KEY
  - title VARCHAR(255) NOT NULL
  - description TEXT NULL
  - due_date DATETIME NULL
  - priority INT NULL
  - completed TINYINT(1) NOT NULL DEFAULT 0
  - order_index INT NULL
  - category_id INT NULL REFERENCES categories(id)
  - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

- reminders:
  - id INT AUTO_INCREMENT PRIMARY KEY
  - task_id INT NOT NULL REFERENCES tasks(id)
  - remind_at DATETIME NOT NULL
  - method VARCHAR(50) DEFAULT 'email'
  - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

- user_preferences:
  - id INT AUTO_INCREMENT PRIMARY KEY
  - user_id INT NOT NULL
  - pref_key VARCHAR(100) NOT NULL
  - pref_value VARCHAR(2000) NOT NULL
  - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  - UNIQUE KEY uniq_user_pref (user_id, pref_key)

Update if your actual schema differs.

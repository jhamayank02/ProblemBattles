package db

import (
	"AuthService/models"
	"context"
	"database/sql"
	"errors"
	"time"
)

type UserRepository interface {
	GetById(ctx context.Context, id string) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	Create(ctx context.Context, username string, email string, hashedPassword string) (*models.User, error)
	GetAll(ctx context.Context) ([]*models.User, error)
	DeleteById(ctx context.Context, id string) (bool, error)
}

type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(_db *sql.DB) UserRepository {
	return &UserRepositoryImpl{
		db: _db,
	}
}

var (
	ErrUserNotFound        = errors.New("user not found")
	ErrInternalServerError = errors.New("internal server error")
)

var (
	getByIdQuery    = "SELECT id, email, username, created_at, updated_at FROM users WHERE id = ?"
	getByEmailQuery = "SELECT id, email, username, password, created_at, updated_at FROM users WHERE email = ?"
	createQuery     = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
	getAllQuery     = "SELECT id, email, username, created_at, updated_at FROM users"
	deleteByIdQuery = "UPDATE users SET is_deleted = 1 WHERE id = ?"
)

func (r *UserRepositoryImpl) GetById(ctx context.Context, id string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	row := r.db.QueryRowContext(ctx, getByIdQuery, id)

	user := &models.User{}
	if err := row.Scan(&user.Id, &user.Email, &user.Username, &user.CreatedAt, &user.UpdatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, ErrInternalServerError
	}

	return user, nil
}

func (r *UserRepositoryImpl) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	row := r.db.QueryRowContext(ctx, getByEmailQuery, email)

	user := &models.User{}
	if err := row.Scan(&user.Id, &user.Email, &user.Username, &user.Password, &user.CreatedAt, &user.UpdatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, ErrInternalServerError
	}

	return user, nil
}

func (r *UserRepositoryImpl) Create(ctx context.Context, username string, email string, hashedPassword string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	result, err := r.db.ExecContext(ctx, createQuery, username, email, hashedPassword)
	if err != nil {
		return nil, ErrInternalServerError
	}
	lastInsertedId, err := result.LastInsertId()
	if err != nil {
		return nil, ErrInternalServerError
	}
	user := &models.User{
		Id:       lastInsertedId,
		Username: username,
		Email:    email,
	}

	return user, nil
}

func (r *UserRepositoryImpl) GetAll(ctx context.Context) ([]*models.User, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	rows, err := r.db.QueryContext(ctx, getAllQuery)
	if err != nil {
		return nil, ErrInternalServerError
	}
	defer rows.Close()

	users := []*models.User{}
	for rows.Next() {
		user := &models.User{}
		if scanErr := rows.Scan(&user.Id, &user.Email, &user.Username, &user.CreatedAt, &user.UpdatedAt); scanErr != nil {
			return nil, ErrInternalServerError
		}
		users = append(users, user)
	}

	return users, nil
}

func (r *UserRepositoryImpl) DeleteById(ctx context.Context, id string) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	row, err := r.db.ExecContext(ctx, deleteByIdQuery, id)
	if err != nil {
		return false, ErrInternalServerError
	}

	rowsAffected, rowErr := row.RowsAffected()
	if rowErr != nil {
		return false, ErrInternalServerError
	}

	if rowsAffected == 0 {
		return false, ErrUserNotFound
	}

	return true, nil
}

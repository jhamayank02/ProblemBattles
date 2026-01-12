package db

import (
	"AuthService/models"
	"context"
	"database/sql"
	"errors"
	"time"
)

type RoleRepository interface {
	GetRoleById(ctx context.Context, id int) (*models.Role, error)
	GetRoleByName(ctx context.Context, name string) (*models.Role, error)
	GetAllRoles(ctx context.Context) ([]*models.Role, error)
	CreateRole(ctx context.Context, name string, description string) (*models.Role, error)
	UpdateRoleById(ctx context.Context, id int, name string, description string) (*models.Role, error)
}

type RoleRepositoryImpl struct {
	db *sql.DB
}

func NewRoleRepository(_db *sql.DB) RoleRepository {
	return &RoleRepositoryImpl{
		db: _db,
	}
}

var (
	ErrRoleNotFound = errors.New("role not found")
)

var (
	createRoleQuery     = "INSERT INTO roles (name,description,created_at) VALUES (?,?,NOW())"
	updateRoleByIdQuery = "UPDATE roles SET name = CASE WHEN ? <> '' THEN ? ELSE name END, description = CASE WHEN ? <> '' THEN ? ELSE description END, updated_at = NOW() WHERE id = ?"
	getRoleByIdQuery    = "SELECT id, name, description, created_at, updated_at FROM roles WHERE id = ?"
	getRoleByNameQuery  = "SELECT id, name, description, created_at, updated_at  FROM roles WHERE name = ?"
	getAllRolesQuery    = "SELECT id, name, description, created_at, updated_at FROM roles"
)

func (r *RoleRepositoryImpl) CreateRole(ctx context.Context, name string, description string) (*models.Role, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	row, err := r.db.ExecContext(ctx, createRoleQuery, name, description)
	if err != nil {
		return nil, ErrInternalServerError
	}

	lastInsertedId, err := row.LastInsertId()
	if err != nil {
		return nil, ErrInternalServerError
	}

	var role models.Role
	err = r.db.QueryRowContext(ctx, getRoleByIdQuery, lastInsertedId).Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRoleNotFound
		}
		return nil, ErrInternalServerError
	}

	return &role, nil
}

func (r *RoleRepositoryImpl) UpdateRoleById(ctx context.Context, id int, name string, description string) (*models.Role, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var existingRole models.Role
	err := r.db.QueryRowContext(ctx, getRoleByIdQuery, id).Scan(&existingRole.Id, &existingRole.Name, &existingRole.Description, &existingRole.CreatedAt, &existingRole.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRoleNotFound
		}
		return nil, ErrInternalServerError
	}

	result, err := r.db.ExecContext(ctx, updateRoleByIdQuery, name, name, description, description, id)
	if err != nil {
		return nil, ErrInternalServerError
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, ErrInternalServerError
	}
	if rowsAffected == 0 {
		return nil, ErrRoleNotFound
	}

	var role models.Role
	err = r.db.QueryRowContext(ctx, getRoleByIdQuery, id).Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRoleNotFound
		}
		return nil, ErrInternalServerError
	}

	return &role, nil
}

func (r *RoleRepositoryImpl) GetRoleById(ctx context.Context, id int) (*models.Role, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	row := r.db.QueryRowContext(ctx, getRoleByIdQuery, id)

	role := &models.Role{}
	if err := row.Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRoleNotFound
		}
		return nil, ErrInternalServerError
	}

	return role, nil
}

func (r *RoleRepositoryImpl) GetRoleByName(ctx context.Context, name string) (*models.Role, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	row := r.db.QueryRowContext(ctx, getRoleByNameQuery, name)
	role := &models.Role{}
	if err := row.Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRoleNotFound
		}
		return nil, ErrInternalServerError
	}

	return role, nil
}

func (r *RoleRepositoryImpl) GetAllRoles(ctx context.Context) ([]*models.Role, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	rows, err := r.db.QueryContext(ctx, getAllRolesQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	roles := []*models.Role{}
	for rows.Next() {
		role := &models.Role{}
		if scanErr := rows.Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt); scanErr != nil {
			return nil, ErrInternalServerError
		}
		roles = append(roles, role)
	}

	if err = rows.Err(); err != nil {
		return nil, ErrInternalServerError
	}

	return roles, nil
}

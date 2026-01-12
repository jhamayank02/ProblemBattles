package db

import (
	"AuthService/models"
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"
)

type UserRoleRepository interface {
	GetUserRoles(ctx context.Context, userId int64) ([]*models.Role, error)
	GetUserPermissions(ctx context.Context, userId int64) ([]*models.Permission, error)
	HasPermission(ctx context.Context, userId int64, permissionName string) (bool, error)
	HasRole(ctx context.Context, userId int, roleName string) (bool, error)
	HasAllRoles(ctx context.Context, userId int, roleNames []string) (bool, error)
	HasAnyRole(ctx context.Context, userId int, roleNames []string) (bool, error)
	AssignRole(ctx context.Context, userId int, roleId int) (bool, error)
	RemoveRole(ctx context.Context, userRoleId int) (bool, error)
}

type UserRoleRepositoryImpl struct {
	db *sql.DB
}

func NewUserRoleRepository(_db *sql.DB) UserRoleRepository {
	return &UserRoleRepositoryImpl{
		db: _db,
	}
}

var (
	getUserRolesQuery = `
		SELECT r.id, r.name, r.description, r.created_at, r.updated_at
		FROM user_roles ur
		INNER JOIN roles r ON ur.role_id = r.id
		WHERE ur.user_id = ?
	`
	getUserPermissionsQuery = `
		SELECT p.id, p.name, p.description, p.resource, p.action, p.created_at, p.updated_at
		FROM user_roles ur
		INNER JOIN role_permissions rp ON ur.role_id = rp.role_id
		INNER JOIN permissions p ON rp.permission_id = p.id
		WHERE ur.user_id = ?`
	hasPermissionsQuery = `
		SELECT COUNT(*) > 0
		FROM user_roles ur
		INNER JOIN role_permissions rp ON ur.role_id = rp.role_id
		INNER JOIN permissions p ON rp.permission_id = p.id
		WHERE ur.user_id = ? AND p.name = ?`
	hasRoleQuery = `
		SELECT COUNT(*) > 0
		FROM user_roles ur
		INNER JOIN roles r ON ur.role_id = r.id
		WHERE ur.user_id = ? AND r.name = ?`
	hasAllRolesQuery = `
		SELECT COUNT(*) = ?
		FROM user_roles ur
		INNER JOIN roles r ON ur.role_id = r.id
		WHERE ur.user_id = ? AND r.name IN (?)
		GROUP BY ur.user_id`
	assignRoleQuery = `
	INSERT INTO user_roles (user_id,role_id) VALUES (?,?)
	`
	removeRoleQuery = `
	DELETE FROM user_roles where id = ?
	`
)

func (u *UserRoleRepositoryImpl) GetUserRoles(ctx context.Context, userId int64) ([]*models.Role, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	rows, err := u.db.QueryContext(ctx, getUserRolesQuery, userId)
	if err != nil {
		return nil, ErrInternalServerError
	}
	defer rows.Close()

	var roles []*models.Role
	for rows.Next() {
		role := &models.Role{}
		if err := rows.Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt); err != nil {
			return nil, ErrInternalServerError
		}
		roles = append(roles, role)
	}

	if err := rows.Err(); err != nil {
		return nil, ErrInternalServerError
	}

	return roles, nil
}

func (u *UserRoleRepositoryImpl) GetUserPermissions(ctx context.Context, userId int64) ([]*models.Permission, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	rows, err := u.db.QueryContext(ctx, getUserPermissionsQuery, userId)
	if err != nil {
		return nil, ErrInternalServerError
	}
	defer rows.Close()

	var permissions []*models.Permission
	for rows.Next() {
		permission := &models.Permission{}
		if err := rows.Scan(&permission.Id, &permission.Name, &permission.Description, &permission.Resource, &permission.Action, &permission.CreatedAt, &permission.UpdatedAt); err != nil {
			return nil, ErrInternalServerError
		}
		permissions = append(permissions, permission)
	}

	if err := rows.Err(); err != nil {
		return nil, ErrInternalServerError
	}

	return permissions, nil
}

func (u *UserRoleRepositoryImpl) HasPermission(ctx context.Context, userId int64, permissionName string) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var exists bool
	err := u.db.QueryRowContext(ctx, hasPermissionsQuery, userId, permissionName).Scan(&exists)
	if err != nil {
		return false, ErrInternalServerError
	}
	return exists, nil
}

func (u *UserRoleRepositoryImpl) HasRole(ctx context.Context, userId int, roleName string) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var exists bool
	err := u.db.QueryRowContext(ctx, hasRoleQuery, userId, roleName).Scan(&exists)
	if err != nil {
		return false, ErrInternalServerError
	}
	return exists, nil
}

func (u *UserRoleRepositoryImpl) HasAllRoles(ctx context.Context, userId int, roleNames []string) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	if len(roleNames) == 0 {
		return true, nil // If no roles are specified, return true
	}

	roleNamesStr := strings.Join(roleNames, ",")

	row := u.db.QueryRowContext(ctx, hasAllRolesQuery, len(roleNames), userId, roleNamesStr)

	var hasAllRoles bool
	if err := row.Scan(&hasAllRoles); err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, ErrInternalServerError
	}

	return hasAllRoles, nil
}

func (u *UserRoleRepositoryImpl) HasAnyRole(ctx context.Context, userId int, roleNames []string) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	if len(roleNames) == 0 {
		return true, nil
	}
	placeholders := strings.Repeat("?,", len(roleNames))
	placeholders = placeholders[:len(placeholders)-1]
	query := fmt.Sprintf("SELECT COUNT(*) > 0 FROM user_roles ur INNER JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = ? AND r.name IN (%s)", placeholders)

	// Create args slice with userId first, then all roleNames
	args := make([]interface{}, 0, 1+len(roleNames))
	args = append(args, userId)
	for _, roleName := range roleNames {
		args = append(args, roleName)
	}

	row := u.db.QueryRowContext(ctx, query, args...)

	var hasAnyRole bool
	if err := row.Scan(&hasAnyRole); err != nil {
		if err == sql.ErrNoRows {
			return false, nil // No roles found for the user
		}
		return false, ErrInternalServerError // Return any other error
	}

	return hasAnyRole, nil
}

func (u *UserRoleRepositoryImpl) AssignRole(ctx context.Context, userId int, roleId int) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	result, err := u.db.ExecContext(ctx, assignRoleQuery, userId, roleId)
	if err != nil {
		return false, ErrInternalServerError
	}

	_, lastInsertedIdErr := result.LastInsertId()
	if lastInsertedIdErr != nil {
		return false, ErrInternalServerError
	}

	return true, nil
}

func (u *UserRoleRepositoryImpl) RemoveRole(ctx context.Context, userRoleId int) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	row, err := u.db.ExecContext(ctx, removeRoleQuery, userRoleId)
	if err != nil {
		return false, ErrInternalServerError
	}

	rowsAffected, rowsAffectedErr := row.RowsAffected()
	if rowsAffectedErr != nil {
		return false, ErrInternalServerError
	}
	if rowsAffected == 0 {
		return false, ErrRoleNotFound
	}

	return true, nil
}

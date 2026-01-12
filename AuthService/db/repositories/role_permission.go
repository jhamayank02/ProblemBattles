package db

import (
	"AuthService/models"
	"context"
	"database/sql"
	"fmt"
	"time"
)

type RolePermissionRepository interface {
	GetRolePermissionByRoleId(ctx context.Context, roleId int) ([]*models.RolePermission, error)
	GetAllRolePermissions(ctx context.Context) ([]*models.RolePermission, error)
}

type RolePermissionRepositoryImpl struct {
	db *sql.DB
}

func NewRolePermissionRepository(_db *sql.DB) RolePermissionRepository {
	return &RolePermissionRepositoryImpl{
		db: _db,
	}
}

var (
	getRolePermissionByRoleIdQuery = `
	SELECT
    r.id AS role_id,
    r.name AS role_name,
    r.description AS role_description,
    p.id AS permission_id,
    p.name AS permission_name,
    p.action AS permission_action,
    p.description AS permission_description,
    p.resource AS permission_resource
	FROM role_permissions AS rp
	LEFT JOIN roles AS r
	    ON rp.role_id = r.id
	LEFT JOIN permissions AS p
	    ON rp.permission_id = p.id
	WHERE rp.role_id = ?
	`
	getAllRolePermissionsQuery = `
	SELECT
    r.id AS role_id,
    r.name AS role_name,
    r.description AS role_description,
    p.id AS permission_id,
    p.name AS permission_name,
    p.action AS permission_action,
    p.description AS permission_description,
    p.resource AS permission_resource
	FROM role_permissions AS rp
	LEFT JOIN roles AS r ON rp.role_id = r.id
	LEFT JOIN permissions AS p ON rp.permission_id = p.id;
	`
)

func (rp *RolePermissionRepositoryImpl) GetRolePermissionByRoleId(ctx context.Context, roleId int) ([]*models.RolePermission, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	rows, err := rp.db.QueryContext(ctx, getRolePermissionByRoleIdQuery, roleId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rolePermissions []*models.RolePermission
	for rows.Next() {
		rolePermission := &models.RolePermission{}
		if err := rows.Scan(&rolePermission.RoleId, &rolePermission.RoleName, &rolePermission.RoleDescription, &rolePermission.PermissionId, &rolePermission.PermissionName, &rolePermission.PermissionAction, &rolePermission.PermissionDescription, &rolePermission.PermissionResource); err != nil {
			return nil, err
		}
		rolePermissions = append(rolePermissions, rolePermission)
	}

	if err := rows.Err(); err != nil {
		fmt.Println(err)
		return nil, err
	}

	return rolePermissions, nil
}

func (rp *RolePermissionRepositoryImpl) GetAllRolePermissions(ctx context.Context) ([]*models.RolePermission, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	rows, err := rp.db.QueryContext(ctx, getAllRolePermissionsQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rolePermissions []*models.RolePermission
	for rows.Next() {
		rolePermission := &models.RolePermission{}
		if err := rows.Scan(&rolePermission.RoleId, &rolePermission.RoleName, &rolePermission.RoleDescription, &rolePermission.PermissionId, &rolePermission.PermissionName, &rolePermission.PermissionAction, &rolePermission.PermissionDescription, &rolePermission.PermissionResource); err != nil {
			return nil, err
		}
		rolePermissions = append(rolePermissions, rolePermission)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return rolePermissions, nil
}

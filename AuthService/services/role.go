package services

import (
	db "AuthService/db/repositories"
	"AuthService/models"
	"context"
)

type RoleService interface {
	GetUserRoles(ctx context.Context, userId int64) ([]*models.Role, error)
	CreateRole(ctx context.Context, name string, description string) (*models.Role, error)
	UpdateRole(ctx context.Context, id int, name string, description string) (*models.Role, error)
	GetRoleById(ctx context.Context, id int) (*models.Role, error)
	GetRoleByName(ctx context.Context, name string) (*models.Role, error)
	GetAllRoles(ctx context.Context) ([]*models.Role, error)
	GetRolePermissions(ctx context.Context, roleId int) ([]*models.RolePermission, error)
	GetAllRolePermissions(ctx context.Context) ([]*models.RolePermission, error)
	AssignRole(ctx context.Context, userId int, roleId int) (bool, error)
	RemoveRole(ctx context.Context, userRoleId int) (bool, error)
}

type RoleServiceImpl struct {
	roleRepository           db.RoleRepository
	rolePermissionRepository db.RolePermissionRepository
	userRoleRepository       db.UserRoleRepository
}

func NewRoleService(roleRepo db.RoleRepository, rolePermissionRepo db.RolePermissionRepository, userRoleRepo db.UserRoleRepository) RoleService {
	return &RoleServiceImpl{
		roleRepository:           roleRepo,
		rolePermissionRepository: rolePermissionRepo,
		userRoleRepository:       userRoleRepo,
	}
}

func (s *RoleServiceImpl) GetUserRoles(ctx context.Context, userId int64) ([]*models.Role, error) {
	return s.userRoleRepository.GetUserRoles(ctx, userId)
}

func (s *RoleServiceImpl) CreateRole(ctx context.Context, name string, description string) (*models.Role, error) {
	return s.roleRepository.CreateRole(ctx, name, description)
}

func (s *RoleServiceImpl) UpdateRole(ctx context.Context, id int, name string, description string) (*models.Role, error) {
	return s.roleRepository.UpdateRoleById(ctx, id, name, description)
}

func (s *RoleServiceImpl) GetRoleById(ctx context.Context, id int) (*models.Role, error) {
	return s.roleRepository.GetRoleById(ctx, id)
}

func (s *RoleServiceImpl) GetRoleByName(ctx context.Context, name string) (*models.Role, error) {
	return s.roleRepository.GetRoleByName(ctx, name)
}

func (s *RoleServiceImpl) GetAllRoles(ctx context.Context) ([]*models.Role, error) {
	return s.roleRepository.GetAllRoles(ctx)
}

func (s *RoleServiceImpl) GetRolePermissions(ctx context.Context, roleId int) ([]*models.RolePermission, error) {
	return s.rolePermissionRepository.GetRolePermissionByRoleId(ctx, roleId)
}

func (s *RoleServiceImpl) GetAllRolePermissions(ctx context.Context) ([]*models.RolePermission, error) {
	return s.rolePermissionRepository.GetAllRolePermissions(ctx)
}

func (s *RoleServiceImpl) AssignRole(ctx context.Context, userId int, roleId int) (bool, error) {
	return s.userRoleRepository.AssignRole(ctx, userId, roleId)
}

func (s *RoleServiceImpl) RemoveRole(ctx context.Context, userRoleId int) (bool, error) {
	return s.userRoleRepository.RemoveRole(ctx, userRoleId)
}

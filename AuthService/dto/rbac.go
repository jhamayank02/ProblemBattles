package dto

type CreateRoleDTO struct {
	Name        string `json:"name" validate:"required,min=2"`
	Description string `json:"description"`
}

type UpdateRoleDTO struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type RoleIdDTO struct {
	Id int `json:"id" validate:"required,min=1"`
}

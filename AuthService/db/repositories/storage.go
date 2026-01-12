package db

// Facilitates dependency injection for repository
type Storage struct {
	UserRepository UserRepository
}

func NewStorage() *Storage {
	return &Storage{
		UserRepository: &UserRepositoryImpl{},
	}
}

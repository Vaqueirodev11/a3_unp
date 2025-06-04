package com.hmpsicoterapia.model;

// Remova as importações JPA que não serão mais usadas se não houver outras entidades neste pacote
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;

// Remova as anotações @Entity e @Table
// @Entity
// @Table(name = "admins")
public class Admin {

    // Remova as anotações @Id e @GeneratedValue
    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Este campo pode permanecer se for usado como um POJO simples

    private String nome;
    private String email;

    // Construtores, getters e setters podem permanecer para um POJO (Plain Old Java Object)
    public Admin() {}

    public Admin(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    // Getters e setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
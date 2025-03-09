import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaClock } from 'react-icons/fa'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// Estilos globais e componentes estilizados
const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 10px;
`

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1.2rem;
`

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
`

const WeekContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
  margin-bottom: 30px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`

const DayCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.3s ease;
  min-height: 200px;
  
  &:hover {
    transform: translateY(-5px);
  }
`

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ecf0f1;
`

const DayTitle = styled.h2`
  color: #3498db;
  margin: 0;
  font-size: 1.3rem;
`

const MaterialList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  min-height: 50px;
`

const MaterialItem = styled.li`
  background-color: ${props => props.completed ? '#e8f5e9' : props.subjectColor || '#f8f9fa'};
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
  user-select: none;
  border-left: 4px solid ${props => props.subjectColor || '#3498db'};
  
  &.dragging {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  }
`

const MaterialText = styled.span`
  flex: 1;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? '#7f8c8d' : '#2c3e50'};
`

const MaterialTime = styled.span`
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-top: 4px;
  display: block;
`

const MaterialInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.color || '#3498db'};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`

const AddButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  transition: transform 0.2s, background-color 0.2s;
  
  &:hover {
    transform: scale(1.1);
    background-color: #2980b9;
  }
`

const FormModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #7f8c8d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #e74c3c;
  }
`

const AddForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  position: relative;
`

const FormRow = styled.div`
  display: flex;
  gap: 10px;
`

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`

const Sidebar = styled.div`
  width: 300px;
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    position: fixed;
    right: ${props => props.open ? '0' : '-300px'};
    top: 0;
    bottom: 0;
    z-index: 1000;
    transition: right 0.3s ease;
  }
`

const SidebarToggle = styled.button`
  position: fixed;
  right: 20px;
  top: 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  display: none;
  z-index: 1001;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const SidebarSection = styled.div`
  margin-bottom: 30px;
`

const SidebarTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.3rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ecf0f1;
`

const MaterialsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const ReminderSection = styled.div`
  margin-top: 20px;
`

const ReminderTitle = styled.h2`
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
`

const ReminderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const ReminderItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`

const ReminderInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const ReminderName = styled.span`
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 5px;
`

const ReminderTime = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
`

const DroppableArea = styled.div`
  min-height: 100px;
`

// Dias da semana em português
const weekDays = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
]

// Cores para as matérias
const subjectColors = {
  'Matemática': '#3498db',
  'Português': '#e74c3c',
  'História': '#f39c12',
  'Geografia': '#2ecc71',
  'Ciências': '#9b59b6',
  'Física': '#1abc9c',
  'Química': '#d35400',
  'Biologia': '#27ae60',
  'Inglês': '#34495e',
  'Educação Física': '#16a085'
}

function App() {
  // Estado para armazenar os materiais de estudo por dia
  const [studyMaterials, setStudyMaterials] = useState(() => {
    const savedMaterials = localStorage.getItem('studyMaterials')
    return savedMaterials ? JSON.parse(savedMaterials) : {
      'Segunda-feira': [],
      'Terça-feira': [],
      'Quarta-feira': [],
      'Quinta-feira': [],
      'Sexta-feira': [],
      'Sábado': [],
      'Domingo': []
    }
  })
  
  // Estado para o formulário de adição de material
  const [newMaterial, setNewMaterial] = useState('')
  const [selectedDay, setSelectedDay] = useState('Segunda-feira')
  const [subjectName, setSubjectName] = useState('')
  const [studyTime, setStudyTime] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Estado para lembretes
  const [reminders, setReminders] = useState(() => {
    const savedReminders = localStorage.getItem('reminders')
    return savedReminders ? JSON.parse(savedReminders) : []
  })
  
  // Estado para edição
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  
  // Estado para edição de nomes de matérias
  const [editingSubject, setEditingSubject] = useState(null)
  const [customSubjects, setCustomSubjects] = useState(() => {
    const savedSubjects = localStorage.getItem('customSubjects')
    return savedSubjects ? JSON.parse(savedSubjects) : subjectColors
  })
  
  // Estado para armazenar a ordem das matérias
  const [subjectsOrder, setSubjectsOrder] = useState(() => {
    const savedOrder = localStorage.getItem('subjectsOrder')
    return savedOrder ? JSON.parse(savedOrder) : Object.keys(subjectColors)
  })
  
  // Salvar no localStorage quando o estado mudar
  useEffect(() => {
    localStorage.setItem('studyMaterials', JSON.stringify(studyMaterials))
  }, [studyMaterials])
  
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders))
  }, [reminders])
  
  useEffect(() => {
    localStorage.setItem('customSubjects', JSON.stringify(customSubjects))
  }, [customSubjects])
  
  useEffect(() => {
    localStorage.setItem('subjectsOrder', JSON.stringify(subjectsOrder))
  }, [subjectsOrder])
  
  // Função para adicionar novo material de estudo
  const handleAddMaterial = (e) => {
    e.preventDefault()
    
    if (!newMaterial.trim()) {
      toast.error('Por favor, insira um material de estudo')
      return
    }
    
    const newItem = {
      id: Date.now(),
      text: newMaterial,
      subject: subjectName.trim() || null,
      time: studyTime.trim() || null,
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    setStudyMaterials(prev => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newItem]
    }))
    
    setNewMaterial('')
    setSubjectName('')
    setStudyTime('')
    toast.success('Material adicionado com sucesso!')
  }
  
  // Função para marcar material como concluído
  const toggleComplete = (day, id) => {
    setStudyMaterials(prev => ({
      ...prev,
      [day]: prev[day].map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }))
    
    // Verificar se o item foi marcado como concluído para mostrar toast
    const item = studyMaterials[day].find(item => item.id === id)
    if (item && !item.completed) {
      toast.success('Material concluído! Bom trabalho!')
    }
  }
  
  // Função para excluir material
  const deleteMaterial = (day, id) => {
    setStudyMaterials(prev => ({
      ...prev,
      [day]: prev[day].filter(item => item.id !== id)
    }))
    toast.info('Material removido')
  }
  
  // Função para iniciar edição
  const startEditing = (item) => {
    setEditingId(item.id)
    setEditText(item.text)
  }
  
  // Função para salvar edição
  const saveEdit = (day, id) => {
    if (!editText.trim()) {
      toast.error('O texto não pode estar vazio')
      return
    }
    
    setStudyMaterials(prev => ({
      ...prev,
      [day]: prev[day].map(item => 
        item.id === id ? { ...item, text: editText } : item
      )
    }))
    
    setEditingId(null)
    setEditText('')
    toast.success('Material atualizado')
  }
  
  // Função para cancelar edição
  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }
  
  // Função para adicionar lembrete
  const addReminder = (day, materialId) => {
    const material = studyMaterials[day].find(item => item.id === materialId)
    if (!material) return
    
    const newReminder = {
      id: Date.now(),
      materialId,
      day,
      text: material.text,
      time: new Date(Date.now() + 3600000).toISOString() // 1 hora no futuro como padrão
    }
    
    setReminders(prev => [...prev, newReminder])
    toast.info(`Lembrete definido para ${material.text}`)
  }
  
  // Função para remover lembrete
  const removeReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id))
    toast.info('Lembrete removido')
  }
  
  // Formatar data para exibição
  const formatReminderTime = (isoString) => {
    const date = new Date(isoString)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  // Função para lidar com o fim do arrasto
  const handleDragEnd = (result) => {
    const { source, destination, type } = result
    
    // Se não houver destino válido ou o item for solto no mesmo lugar
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return
    }
    
    // Se for arrasto de matérias na barra lateral
    if (type === 'subjects') {
      const newSubjectsOrder = Array.from(subjectsOrder)
      const [movedSubject] = newSubjectsOrder.splice(source.index, 1)
      newSubjectsOrder.splice(destination.index, 0, movedSubject)
      
      setSubjectsOrder(newSubjectsOrder)
      toast.success('Ordem das matérias atualizada')
      return
    }
    
    // Se for arrasto de materiais de estudo entre dias
    // Obter o dia de origem e destino
    const sourceDay = source.droppableId
    const destinationDay = destination.droppableId
    
    // Criar cópias dos arrays para manipulação
    const newStudyMaterials = {...studyMaterials}
    
    // Remover o item da origem
    const [movedItem] = newStudyMaterials[sourceDay].splice(source.index, 1)
    
    // Adicionar o item ao destino
    newStudyMaterials[destinationDay].splice(destination.index, 0, movedItem)
    
    // Atualizar o estado
    setStudyMaterials(newStudyMaterials)
    
    // Notificar o usuário
    if (sourceDay !== destinationDay) {
      toast.success(`Material movido para ${destinationDay}`)
    }
  }

  // Função para abrir o formulário de adição
  const openAddForm = () => {
    setShowAddForm(true);
  }

  // Função para fechar o formulário de adição
  const closeAddForm = () => {
    setShowAddForm(false);
  }

  // Função para alternar a barra lateral em dispositivos móveis
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  // Função para obter a cor da matéria
  const getSubjectColor = (subject) => {
    return customSubjects[subject] || '#3498db';
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <AppContainer>
        <MainContent>
          <Header>
            <Title>Plano de Estudos</Title>
            <Subtitle>Organize seus materiais de estudo ao longo da semana</Subtitle>
          </Header>
          
          <WeekContainer>
            {weekDays.map(day => (
              <DayCard key={day}>
                <DayHeader>
                  <DayTitle>{day}</DayTitle>
                </DayHeader>
                
                <Droppable droppableId={day}>
                  {(provided, snapshot) => (
                    <DroppableArea
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <MaterialList>
                        {studyMaterials[day].length === 0 ? (
                          <p>Nenhum material para este dia</p>
                        ) : (
                          studyMaterials[day].map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <MaterialItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  completed={item.completed}
                                  className={snapshot.isDragging ? 'dragging' : ''}
                                  subjectColor={item.subject ? getSubjectColor(item.subject) : null}
                                >
                                  {editingId === item.id ? (
                                    <>
                                      <Input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        autoFocus
                                      />
                                      <ActionButtons>
                                        <IconButton 
                                          onClick={() => saveEdit(day, item.id)}
                                          color="#4caf50"
                                        >
                                          <FaCheck />
                                        </IconButton>
                                        <IconButton 
                                          onClick={cancelEdit}
                                          color="#e74c3c"
                                        >
                                          <FaTimes />
                                        </IconButton>
                                      </ActionButtons>
                                    </>
                                  ) : (
                                    <>
                                      <MaterialInfo>
                                        {item.subject && (
                                          <strong style={{ color: getSubjectColor(item.subject), fontSize: '0.9rem' }}>
                                            {item.subject}
                                          </strong>
                                        )}
                                        <MaterialText completed={item.completed}>
                                          {item.text}
                                        </MaterialText>
                                        {item.time && (
                                          <MaterialTime>
                                            <FaClock style={{ marginRight: '4px' }} /> {item.time}
                                          </MaterialTime>
                                        )}
                                      </MaterialInfo>
                                      <ActionButtons>
                                        <IconButton 
                                          onClick={() => toggleComplete(day, item.id)}
                                          color={item.completed ? '#7f8c8d' : '#4caf50'}
                                        >
                                          <FaCheck />
                                        </IconButton>
                                        <IconButton 
                                          onClick={() => startEditing(item)}
                                          color="#f39c12"
                                        >
                                          <FaEdit />
                                        </IconButton>
                                        <IconButton 
                                          onClick={() => deleteMaterial(day, item.id)}
                                          color="#e74c3c"
                                        >
                                          <FaTrash />
                                        </IconButton>
                                      </ActionButtons>
                                    </>
                                  )}
                                </MaterialItem>
                              )}
                            </Draggable>
                          ))
                        )}
                      </MaterialList>
                      {provided.placeholder}
                    </DroppableArea>
                  )}
                </Droppable>
              </DayCard>
            ))}
          </WeekContainer>
        </MainContent>
        
        <Sidebar open={sidebarOpen}>
          <SidebarSection>
            <SidebarTitle>Matérias</SidebarTitle>
            <Droppable droppableId="subjects-list" type="subjects">
              {(provided) => (
                <MaterialsList
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {subjectsOrder
                    .filter(subject => customSubjects[subject]) // Filtrar apenas matérias que existem
                    .map((subject, index) => (
                    <Draggable
                      key={subject}
                      draggableId={`subject-${subject}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <MaterialItem 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          key={subject} 
                          subjectColor={customSubjects[subject]} 
                          style={{ 
                            ...provided.draggableProps.style,
                            height: '40px',
                            boxShadow: snapshot.isDragging ? '0 5px 10px rgba(0, 0, 0, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          {editingSubject === subject ? (
                            <Input
                              type="text"
                              defaultValue={subject}
                              autoFocus
                              onBlur={(e) => {
                                if (e.target.value.trim() && e.target.value !== subject) {
                                  const newSubjects = { ...customSubjects };
                                  const colorValue = newSubjects[subject];
                                  delete newSubjects[subject];
                                  newSubjects[e.target.value.trim()] = colorValue;
                                  setCustomSubjects(newSubjects);
                                  
                                  // Atualizar a ordem das matérias
                                  const newOrder = [...subjectsOrder];
                                  const subjectIndex = newOrder.indexOf(subject);
                                  if (subjectIndex !== -1) {
                                    newOrder[subjectIndex] = e.target.value.trim();
                                    setSubjectsOrder(newOrder);
                                  }
                                  
                                  // Atualizar referências nos materiais de estudo
                                  const updatedMaterials = { ...studyMaterials };
                                  Object.keys(updatedMaterials).forEach(day => {
                                    updatedMaterials[day] = updatedMaterials[day].map(item => {
                                      if (item.subject === subject) {
                                        return { ...item, subject: e.target.value.trim() };
                                      }
                                      return item;
                                    });
                                  });
                                  setStudyMaterials(updatedMaterials);
                                  toast.success('Nome da matéria atualizado!');
                                }
                                setEditingSubject(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.target.blur();
                                } else if (e.key === 'Escape') {
                                  setEditingSubject(null);
                                }
                              }}
                            />
                          ) : (
                            <MaterialText 
                              onClick={() => setEditingSubject(subject)}
                              style={{ cursor: 'pointer' }}
                            >
                              {subject}
                            </MaterialText>
                          )}
                        </MaterialItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </MaterialsList>
              )}
            </Droppable>
          </SidebarSection>
          
          <ReminderSection>
            <SidebarTitle>Lembretes</SidebarTitle>
            {reminders.length === 0 ? (
              <p>Nenhum lembrete definido</p>
            ) : (
              <ReminderList>
                {reminders.map(reminder => (
                  <ReminderItem key={reminder.id}>
                    <ReminderInfo>
                      <ReminderName>{reminder.text}</ReminderName>
                      <ReminderTime>
                        <FaClock /> {formatReminderTime(reminder.time)} - {reminder.day}
                      </ReminderTime>
                    </ReminderInfo>
                    <IconButton 
                      onClick={() => removeReminder(reminder.id)}
                      color="#e74c3c"
                    >
                      <FaTrash />
                    </IconButton>
                  </ReminderItem>
                ))}
              </ReminderList>
            )}
          </ReminderSection>
        </Sidebar>
        
        <SidebarToggle onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes /> : <FaPlus />}
        </SidebarToggle>
        
        <AddButton onClick={openAddForm}>
          <FaPlus />
        </AddButton>
        
        <FormModal show={showAddForm}>
          <AddForm onSubmit={(e) => {
            e.preventDefault();
            handleAddMaterial(e);
            closeAddForm();
          }}>
            <CloseButton type="button" onClick={closeAddForm}>
              <FaTimes />
            </CloseButton>
            <FormRow>
              <Input
                type="text"
                placeholder="Nome da matéria (ex: Física, Português)..."
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </FormRow>
            <FormRow>
              <Input
                type="text"
                placeholder="Adicionar novo material de estudo..."
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Horário (opcional, ex: 14:00 - 15:00)"
                value={studyTime}
                onChange={(e) => setStudyTime(e.target.value)}
              />
            </FormRow>
            <FormRow>
              <Select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {weekDays.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Select>
              <Button type="submit">
                <FaPlus /> Adicionar
              </Button>
            </FormRow>
          </AddForm>
        </FormModal>
      </AppContainer>
    </DragDropContext>
  )
}

export default App